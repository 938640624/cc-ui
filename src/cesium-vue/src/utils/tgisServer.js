import Axios from "axios";
import xml2js from "xml2js";
import { getQueryObject } from "./getQuery";

let cache = null

export async function getCapabilities (mapUrl, queryObj) {
  const query = `?service=${queryObj.service}&version=${queryObj.version}&request=GetCapabilities`;
  const capabilitiesUrl = `${mapUrl.split("?")[0]}${query}`;
  if (cache === null) {
    cache = {}
  }
  if (!cache[capabilitiesUrl]) {
    cache[capabilitiesUrl] = (async () => {
      const { data } = await Axios.get(capabilitiesUrl);
      const capabilitiesObj = await xml2js.parseStringPromise(data, {
        trim: true,
        explicitRoot: false,
        explicitArray: false,
        tagNameProcessors: [
          val => val.replace("ows:", "")
        ]
      })
      return capabilitiesObj
    })()
  }
  setTimeout(() => {
    cache = null
  }, 5000);
  return cache[capabilitiesUrl]
}

export async function getWebMapTileServiceImageryProvider (tgisLayer, opts = {}) {
  const queryObj = getQueryObject(tgisLayer.mapurl, true);
  const capabilities = await getCapabilities(tgisLayer.mapurl, queryObj);
  const { layer, format, tilematrixset: tileMatrixSetID } = queryObj;
  const { WGS84BoundingBox, Style, ResourceURL, TileMatrixSetLink } = capabilities.Contents.Layer.find(l => l.Identifier === layer);
  const [left, bottom] = WGS84BoundingBox.LowerCorner.split(" ");
  const [right, top] = WGS84BoundingBox.UpperCorner.split(" ");
  const { $: { template: url } } = ResourceURL.find(e => e.$.format === format);
  const hitTmsl = TileMatrixSetLink.find(e => e.TileMatrixSet === tileMatrixSetID);
  const tileMatrixLabels = hitTmsl.TileMatrixSetLimits.TileMatrixLimits.map(e => e.TileMatrix);
  return new Cesium.WebMapTileServiceImageryProvider({
    url,
    layer,
    credit: new Cesium.Credit(layer),
    style: Style.Identifier,
    format,
    tileMatrixSetID,
    tileMatrixLabels: tileMatrixLabels,
    maximumLevel: tileMatrixLabels.length - 1,
    tilingScheme: new Cesium.WebMercatorTilingScheme(), // 采用 EPSG:3857的web墨卡托投影
    rectangle: new Cesium.Rectangle(
      Cesium.Math.toRadians(Number.parseFloat(left)),
      Cesium.Math.toRadians(Number.parseFloat(bottom)),
      Cesium.Math.toRadians(Number.parseFloat(right)),
      Cesium.Math.toRadians(Number.parseFloat(top))
    ),
    ...opts
  });
}

export async function getWebMapServiceImageryProvider (tgisLayer, opts = {}) {
  const queryObj = getQueryObject(tgisLayer.mapurl, true);
  queryObj.version = "1.3.0";
  const capabilities = await getCapabilities(tgisLayer.mapurl, queryObj);
  const { layers, format, transparent } = queryObj;
  // eslint-disable-next-line camelcase
  const { EX_GeographicBoundingBox, Style } = capabilities.Capability.Layer.Layer.find(l => l.Name === layers);
  return new Cesium.WebMapServiceImageryProvider({
    url: tgisLayer.mapurl.split("?")[0],
    layers,
    style: Array.isArray(Style) ? Style[0].Name : Style.Name,
    format,
    parameters: {
      transparent: transparent === "true",
      format,
    },
    rectangle: new Cesium.Rectangle(
      Cesium.Math.toRadians(Number.parseFloat(EX_GeographicBoundingBox.westBoundLongitude)),
      Cesium.Math.toRadians(Number.parseFloat(EX_GeographicBoundingBox.southBoundLatitude)),
      Cesium.Math.toRadians(Number.parseFloat(EX_GeographicBoundingBox.eastBoundLongitude)),
      Cesium.Math.toRadians(Number.parseFloat(EX_GeographicBoundingBox.northBoundLatitude))
    )
  });
}

export async function getUrlTemplateImageryProvider (tgisLayer, opts = {}) {
  return new Cesium.UrlTemplateImageryProvider({
    url: tgisLayer.mapurl,
    ...opts
  });
}

export async function getCesium3DTileset (tgisLayer, opts = {}) {
  const tileset = new Cesium.Cesium3DTileset({
    url: tgisLayer.mapurl,
    // customShader: new Cesium.CustomShader({
    //   lightingModel: Cesium.LightingModel.UNLIT,
    //   fragmentShaderText: `
    //   void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material){
    //     material.diffuse = vec3(fsInput.attributes.positionMC.z / 50.0);
    //   }`
    // }),
    // ...opts
  });
  tileset.style = new Cesium.Cesium3DTileStyle({
    color: "color('#488DD2')",
  });

  return tileset;
}

export default async function (viewer, url) {
  const { data } = await Axios.get(url)
  const { layers } = normalizeTgisData(data);
  // Cesium.ExperimentalFeatures.enableModelExperimental = true;
  const typeMap = {
    1: async function (tgisLayer) {
      const layer = await getWebMapServiceImageryProvider(tgisLayer);
      viewer.imageryLayers.addImageryProvider(layer)
      return layer;
    },
    2: async function (tgisLayer) {
      const layer = await getWebMapTileServiceImageryProvider(tgisLayer);
      viewer.imageryLayers.addImageryProvider(layer)
      return layer;
    },
    3: async function (tgisLayer) {
      const layer = await getUrlTemplateImageryProvider(tgisLayer);
      viewer.imageryLayers.addImageryProvider(layer)
      return layer;
    },
    4: async function (tgisLayer) {
      const tms = await getCesium3DTileset(tgisLayer);
      viewer.scene.primitives.add(tms)
      return tms;
    }
  }
  const promiseArr = layers.map(tgisLayer => typeMap[tgisLayer.srvtype](tgisLayer));
  return await Promise.all(promiseArr)
}

function normalizeTgisData (data) {
  const { children: tgisLayers, centerPoint, scale } = data.content[0];
  tgisLayers.sort((a, b) => b.sort - a.sort);
  const layers = tgisLayers.reduce((arr, curLayer) => [...arr, ...curLayer.mapinfos], [])
  return { layers, centerPoint, scale };
}
