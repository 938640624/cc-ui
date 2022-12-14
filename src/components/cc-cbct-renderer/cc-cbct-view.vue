<template>
    <div class="cc-cbct-view">
        <div class="view-left">
            <div v-for="(view, key) in viewDataArray" :key="key" class="view-box">
                <cc-cbct-viewbox
                    :volumes="volumes"
                    :sliceIntersection="sliceIntersection"
                    :views="viewDataArray"
                    :onCreated="saveComponentRefGenerator(key)"
                    :index="key"
                    @rotate="onRotate"
                    @thickness="onThickness"
                />
            </div>
            <view-3d :volumes="volumes"></view-3d>
        </div>
        <div class="view-right"></div>
    </div>
</template>
<script>
import view3d from './components/view-3d.vue'
import ccCbctViewbox from './cc-cbct-viewbox.vue'
import vtkVolume from '@kitware/vtk.js/Rendering/Core/Volume'
import vtkVolumeMapper from '@kitware/vtk.js/Rendering/Core/VolumeMapper'
import vtkPlane from '@kitware/vtk.js/Common/DataModel/Plane'
// import vtkMatrixBuilder from '@kitware/vtk.js/Common/Core/MatrixBuilder'
// import vtkCoordinate from '@kitware/vtk.js/Rendering/Core/Coordinate'
import vtkInteractorStyleMPRWindowLevel from '@/components/cc-cbct-renderer/model/vtkInteractorStyleMPRWindowLevel'
import vtkInteractorStyleMPRCrosshairs from '@/components/cc-cbct-renderer/model/vtkInteractorStyleMPRCrosshairs.js'
export default {
    components: {
        ccCbctViewbox,
        view3d,
    },
    data() {
        return {
            showDistance: false,
            selectedTab: 'tool',
            volumes: [],
            components: [],
            focusedWidgetId: null,
            activeTool: 'LEVEL',
            loading: true,
            sliceIntersection: [0, 0, 0],
            // TODO: refactor into prop.
            syncWindowLevels: true,
            top: {
                color: '#f00',
                slicePlaneNormal: [0, 0, -1],
                sliceViewUp: [0, -1, 0],
                slicePlaneXRotation: 0,
                slicePlaneYRotation: 0,
                viewRotation: 0,
                sliceThickness: 0.1,
                blendMode: 'none',
                window: {
                    width: 0,
                    center: 0,
                },
            },
            left: {
                color: '#0f0',
                slicePlaneNormal: [1, 0, 0],
                sliceViewUp: [0, 0, -1],
                slicePlaneXRotation: 0,
                slicePlaneYRotation: 0,
                viewRotation: 0,
                sliceThickness: 0.1,
                blendMode: 'none',
                window: {
                    width: 0,
                    center: 0,
                },
            },
            front: {
                color: '#00f',
                slicePlaneNormal: [0, -1, 0],
                sliceViewUp: [0, 0, -1],
                slicePlaneXRotation: 0,
                slicePlaneYRotation: 0,
                viewRotation: 0,
                sliceThickness: 0.1,
                blendMode: 'none',
                window: {
                    width: 0,
                    center: 0,
                },
            },
            three: {},
        }
    },
    computed: {
        newImageData() {
            return this.imageData()
        },
        viewDataArray() {
            return { top: this.top, left: this.left, front: this.front }
        },
    },
    provide() {
        return {
            getSliceIntersection: this.getSliceIntersection,
            onScrolled: this.onScrolled,
            getRenderWindow: this.getRenderWindow,
        }
    },
    inject: ['imageData'],
    methods: {
        initView() {
            const volumeActor = vtkVolume.newInstance()
            // vtkVolumeMapper继承自mapper，使用片段程序在GPU上执行光线投射的体积映射器
            const volumeMapper = vtkVolumeMapper.newInstance()
            // 设置用于渲染的样本之间的距离
            volumeMapper.setSampleDistance(1)
            volumeActor.setMapper(volumeMapper)
            volumeMapper.setInputData(this.newImageData)
            const rgbTransferFunction = volumeActor
                // getProperty 获取actors表面属性的属性对象，是vtkProperty对象的实例
                .getProperty()
                .getRGBTransferFunction(0)
            rgbTransferFunction.setMappingRange(500, 3000)
            // 设置view-box的中心点和宽度
            Object.values(this.viewDataArray).forEach((view) => {
                view.window.center = 500
                view.window.width = 3000
            })
            this.sliceIntersection = this.getVolumeCenter(volumeMapper)
            this.volumes = [volumeActor]
        },

        onScrolled() {
            console.log('scrolled')
            const planes = []
            Object.values(this.components).forEach((component) => {
                const camera = component.genericRenderWindow.getRenderer().getActiveCamera()
                planes.push({
                    position: camera.getFocalPoint(),
                    normal: camera.getDirectionOfProjection(),
                })
            })
            const newPoint = this.getPlaneIntersection(...planes)
            if (!Number.isNaN(newPoint)) {
                this.sliceIntersection = newPoint
            }
            return newPoint
        },

        saveComponentRefGenerator(viewportIndex) {
            return (component) => {
                this.components[viewportIndex] = component
                const { windowWidth, windowLevel } = this.getVOI(component.volumes[0])
                // get initial window leveling
                this[viewportIndex].windowWidth = windowWidth
                this[viewportIndex].windowLevel = windowLevel
                const renderWindow = component.genericRenderWindow.getRenderWindow()
                renderWindow.getInteractor().getInteractorStyle().setVolumeMapper(null)
                // this.setLevelTool([viewportIndex, component])
                renderWindow.render()
            }
        },

        onRotate(index, axis, angle) {
            console.log('旋转')
            switch (index) {
                case 'top':
                    if (axis === 'x') this.front.slicePlaneYRotation = angle
                    else if (axis === 'y') this.left.slicePlaneYRotation = angle
                    break
                case 'left':
                    if (axis === 'x') this.top.slicePlaneXRotation = angle
                    else if (axis === 'y') this.front.slicePlaneXRotation = angle
                    break
                case 'front':
                    if (axis === 'x') this.top.slicePlaneYRotation = angle
                    else if (axis === 'y') this.left.slicePlaneXRotation = angle
                    break
            }
        },

        onThickness(index, axis, thickness) {
            console.log('拉伸')
            const shouldBeMIP = thickness > 1
            let view
            switch (index) {
                case 'top':
                    if (axis === 'x') view = this.front
                    else if (axis === 'y') view = this.left
                    break
                case 'left':
                    if (axis === 'x') view = this.top
                    else if (axis === 'y') view = this.front
                    break
                case 'front':
                    if (axis === 'x') view = this.top
                    else if (axis === 'y') view = this.left
                    break
            }
            view.sliceThickness = thickness
            if (shouldBeMIP && view.blendMode === 'none') view.blendMode = 'MIP'
        },

        setLevelTool([viewportIndex, component]) {
            const istyle = vtkInteractorStyleMPRWindowLevel.newInstance()
            istyle.setOnScroll(this.onScrolled)
            istyle.setOnLevelsChanged((levels) => {
                this.updateLevels({ ...levels, index: viewportIndex })
            })
            this.setInteractor(component, istyle)
        },

        setCrosshairTool([viewportIndex, component]) {
            const istyle = vtkInteractorStyleMPRCrosshairs.newInstance()
            istyle.setOnScroll(this.onScrolled)
            istyle.setOnClickCallback(({ worldPos }) =>
                this.onCrosshairPointSelected({ worldPos, index: viewportIndex })
            )
            this.setInteractor(component, istyle)
        },

        setInteractor(component, istyle) {
            const renderWindow = component.genericRenderWindow.getRenderWindow()
            //我们假设旧的样式总是从MPRSlice样式扩展而来
            const oldStyle = renderWindow.getInteractor().getInteractorStyle()
            renderWindow.getInteractor().setInteractorStyle(istyle)
            istyle.setInteractor(renderWindow.getInteractor())
            const inter = renderWindow.getInteractor()
            inter.setInteractorStyle(istyle)
            // 将以前的交互器样式复制到新的交互器中
            if (istyle.setSliceNormal && oldStyle.getSliceNormal()) {
                istyle.setSliceNormal(oldStyle.getSliceNormal(), oldStyle.getViewUp(), [0, 0, 0])
            }
            if (istyle.setSlabThickness && oldStyle.getSlabThickness()) {
                istyle.setSlabThickness(oldStyle.getSlabThickness())
            }
            istyle.setVolumeMapper(component.volumes[0])
        },

        updateLevels({ windowCenter, windowWidth, index }) {
            this[index].window.center = windowCenter
            this[index].window.width = windowWidth

            if (this.syncWindowLevels) {
                Object.entries(this.components)
                    .filter(([key]) => key !== index)
                    .forEach(([key, component]) => {
                        this[key].window.center = windowCenter
                        this[key].window.width = windowWidth
                        component.genericRenderWindow
                            .getInteractor()
                            .getInteractorStyle()
                            .setWindowLevel(windowWidth, windowCenter)
                        component.genericRenderWindow.getRenderWindow().render()
                    })
            }
        },

        getRenderWindow(index) {
            return this.components[index].genericRenderWindow
        },

        getSliceIntersection() {
            return this.sliceIntersection
        },

        getPlaneIntersection(plane1, plane2, plane3) {
            try {
                // intersectWithPlane：给定由法线n0和n1以及原点p0和p1定义的平面，计算平面交点的线，返回一个对象
                let line = vtkPlane.intersectWithPlane(plane1.position, plane1.normal, plane2.position, plane2.normal)
                if (line.intersection) {
                    const { l0, l1 } = line
                    // intersectWithLine：给定一条由两点定义的直线，和法线n和点p0定义的平面，计算交点，返回对象
                    const intersectionLocation = vtkPlane.intersectWithLine(l0, l1, plane3.position, plane3.normal)
                    if (intersectionLocation.intersection) {
                        return intersectionLocation.x
                    }
                }
            } catch (err) {
                console.log('some issue calculating the plane intersection')
            }
            return NaN
        },

        getVolumeCenter(volumeMapper) {
            // 获取此映射器的边界作为 [xmin, xmax, ymin, ymax,zmin, zmax]
            const bounds = volumeMapper.getBounds()
            return [(bounds[0] + bounds[1]) / 2.0, (bounds[2] + bounds[3]) / 2.0, (bounds[4] + bounds[5]) / 2.0]
        },

        getVOI(volume) {
            const rgbTransferFunction = volume.getProperty().getRGBTransferFunction(0)
            const range = rgbTransferFunction.getMappingRange()
            const windowWidth = range[0] + range[1]
            const windowCenter = range[0] + windowWidth / 2
            return {
                windowCenter,
                windowWidth,
            }
        },
    },
    mounted() {
        this.resizeFunction = () => {
            window.setTimeout(() => {
                this.onScrolled()
            }, 10)
        }
        window.addEventListener('resize', this.resizeFunction)
        this.initView()
    },
}
</script>
<style lang="scss" scoped>
.cc-cbct-view {
    width: 100%;
    height: 100%;
    display: flex;
    margin: 0;
    .view-left {
        width: calc(100% - 410px);
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        .view-box {
            width: 50%;
            height: 50%;
        }
    }
    .view-right {
        width: 410px;
        height: 100%;
    }
}
</style>
