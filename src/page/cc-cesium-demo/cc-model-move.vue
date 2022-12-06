<template>
    <div class="cc-model-move">
        <cc-header :headtitle="'ModelMove(模型移动)'" />
        <cc-scroll>
            <div class="map-box">
                <div id="cesiumContainer"></div>
            </div>
            <!-- <CesiumViewer /> -->
        </cc-scroll>
    </div>
</template>
<script>
const COMPONENT_NAME = 'cc-model-move'
// import * as Cesium from 'cesium'
// import 'cesium/Build/Cesium/Widgets/widgets.css'
// import CesiumViewer from '../../components/CesiumExample/No01-init'
import ccHeader from '../../components/cc-header/cc-header.vue'
import ccScroll from '../../components/cc-scroll/cc-scroll.vue'
export default {
    name: COMPONENT_NAME,
    components: {
        ccHeader,
        ccScroll,
        // CesiumViewer
    },
    props: {},
    data() {
        return {}
    },
    mounted() {
        this.initView()
    },
    methods: {
        initView() {
            // var viewer = new Cesium.Viewer("cesiumContainer")
            // console.log(viewer, "viewer");
            const vmodels = Cesium.createDefaultImageryProviderViewModels()
            // const token = '0b018552994f71a9467d24461a8f8238'
            Cesium.Ion.defaultAccessToken =
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZjQ0Mjg3Yy05ZDcxLTQyZDAtYTY3Yy03YmI0MDM3MDZhMjgiLCJpZCI6NzI3NjQsImlhdCI6MTYzNjM2MDU3MH0.yEsenwMWNDoP9-4CoT77mLJpJNJKtbiDSaD9jiv5O8s'
            const viewer = new Cesium.Viewer('cesiumContainer', {
                geocoder: true,
                // homeButton:视角返回初始位置
                homeButton: true,
                // sceneModePicker:选择视角的模式，分别为3d,2d,哥伦布视图
                sceneModePicker: true,
                // baseLayerPicker：图层选择器，选择要显示的地图服务和地形服务
                baseLayerPicker: true,
                // navigationHelpButton：导航帮助按钮，显示默认的地图控制帮助
                navigationHelpButton: true,
                // animation:动画器件，控制视图动画的播放速度
                animation: true,
                // creditContainer:版权显示，显示数据归属，必选
                // creditContainer: "credit",
                // timeline: 时间线设置，控制视图动画的播放速度
                timeline: true,
                // fullscreenButton: 全屏按钮
                fullscreenButton: true,
                // shouldAnimate: 表示可以提前模拟动画事件
                shouldAnimate: true,
                // vrButton: vr按钮
                vrButton: true,
                imageryProviderViewModels: vmodels,
                // selectedImageryProviderViewModel: 选择基础图象层的视图模型
                selectedImageryProviderViewModel: vmodels[0],
            })
            viewer.scene.debugShowFramesPerSecond = true // 显示帧速(fps)
            // JulianDate ：表示一个天文儒略日期，此类将日期的整数部分和日期的秒部分存储在单独的组件中
            // fromDate(data(js日期), result(现有日期实例)):从js日期中创建一个新实例
            var start = Cesium.JulianDate.fromDate(new Date(2021, 11, 23, 17))
            var totalSeconds = 10 // 动画持续的时间
            // addSeconds(julianDate(日期), seconds(添加或减去的秒数), result(用于结果的现有实例)):将提供的秒速添加到提供的日期实例
            var stop = Cesium.JulianDate.addSeconds(start, totalSeconds, new Cesium.JulianDate())
            viewer.clock.startTime = start.clone() // 时钟的开始时间
            viewer.clock.stopTime = stop.clone() // 时钟的停止时间
            viewer.clock.currentTime = start.clone() // 当前时间
            // clockRange：用来确认何时达到startTime或stopTime行为的常量
            // LOOP_STOP: 当stopTime到达时，tick将前进，让当前时间将变为stopTime，时间倒退时， tick不会前进startTime
            viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP
            viewer.timeline.zoomTo(start, stop) // 时间轴视图设置开始时间和停止时间

            // 在两个位置之间跳跃，为我们的车辆创造一条路径
            // SampledPositionProperty(referenceFrame(定义参考系) , numberOfDerivatives(位置衍生品))：获取采样位置属性
            var position = new Cesium.SampledPositionProperty()
            var startPosition = new Cesium.Cartesian3(-2379556.799372864, -4665528.205030263, 3628013.106599678)
            var endPosition = new Cesium.Cartesian3(-2379603.7074103747, -4665623.48990283, 3627860.82704567)
            // 速度矢量的性质可以告诉我们物体在任何给定时间的速度和方向
            // VelocityVectorProperty(position(计算速度的位置属性) , normalize(是否对计算出的速度向量进行归一化))：根据提供的速度计算为Cartesian3向量PositionProperty
            var velocityVectorProperty = new Cesium.VelocityVectorProperty(position, false)
            var velocityVector = new Cesium.Cartesian3()
            // 将车轮随时间的旋转存储在SampledProperty中
            // SampledProperty(type(类型), derivativeTypes(样本包含指定类型的派生信息))：从提供的样本集的内插对于给定的时间和指定的内插算法和程度
            var wheelAngleProperty = new Cesium.SampledProperty(Number)
            var wheelAngle = 0

            var numberOfSamples = 100
            for (var i = 0; i <= numberOfSamples; ++i) {
                var factor = i / numberOfSamples
                var time = Cesium.JulianDate.addSeconds(start, factor * totalSeconds, new Cesium.JulianDate())

                // Lerp采用非线性因素，使车辆加速
                var locationFactor = Math.pow(factor, 2) // 2次方
                // lerp(start, end, t(沿 t 进行插值的点), result):使用提供的笛卡尔函数计算 t 处的线性内插或外推
                var location = Cesium.Cartesian3.lerp(
                    startPosition,
                    endPosition,
                    locationFactor,
                    new Cesium.Cartesian3()
                )
                // addSample(time, position, derivatives(指定时间数组)):添加新样本
                position.addSample(time, location)
                // 根据车辆在每个时间步的移动速度来旋转车轮
                // getValue(time , result(值存储到的对象))：在提供的时间获取属性的值
                velocityVectorProperty.getValue(time, velocityVector)
                // magnitude(Cartesian3)：计算笛卡尔的幅度（长度）
                var metersPerSecond = Cesium.Cartesian3.magnitude(velocityVector)
                var wheelRadius = 0.52 //in meters.
                var circumference = Math.PI * wheelRadius * 2
                var rotationsPerSecond = metersPerSecond / circumference

                wheelAngle += ((Math.PI * 2 * totalSeconds) / numberOfSamples) * rotationsPerSecond
                wheelAngleProperty.addSample(time, wheelAngle)
            }

            function updateSpeedLabel(time) {
                velocityVectorProperty.getValue(time, velocityVector)
                var metersPerSecond = Cesium.Cartesian3.magnitude(velocityVector)
                var kmPerHour = Math.round(metersPerSecond * 3.6)

                return kmPerHour + ' km/hr'
            }

            var rotationProperty = new Cesium.CallbackProperty(function (time, result) {
                return Cesium.Quaternion.fromAxisAngle(
                    Cesium.Cartesian3.UNIT_X,
                    wheelAngleProperty.getValue(time),
                    result
                )
            }, false)

            var wheelTransformation = new Cesium.NodeTransformationProperty({
                rotation: rotationProperty,
            })

            var nodeTransformations = {
                Wheels: wheelTransformation,
                Wheels_mid: wheelTransformation,
                Wheels_rear: wheelTransformation,
            }

            // Add our vehicle model.
            var vehicleEntity = viewer.entities.add({
                position: position,
                orientation: new Cesium.VelocityOrientationProperty(position), // 自动设置车辆的方向，它面对的方向
                model: {
                    uri: '/models/GroundVehicle.glb',
                    runAnimations: false, // 指定是否应启动模型中指定的 glTF 动画
                    nodeTransformations: nodeTransformations, //一个对象，其中键是节点的名称，值是TranslationRotationScale描述要应用于该节点的转换的属性。转换在 glTF 中指定的节点现有转换之后应用，并且不会替换节点的现有转换
                },
                label: {
                    text: new Cesium.CallbackProperty(updateSpeedLabel, false),
                    font: '20px sans-serif',
                    showBackground: true, // 指定标签后面背景的可见性
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 100.0), //指定将在距相机多远的地方显示此标签
                    eyeOffset: new Cesium.Cartesian3(0, 3.5, 0), // 一个Cartesian3属性指定的眼睛偏移
                },
            })

            viewer.trackedEntity = vehicleEntity // 获取或设置相机当前正在跟踪的实体实例
            vehicleEntity.viewFrom = new Cesium.Cartesian3(-10.0, 7.0, 4.0) // 获取或设置跟踪此对象时建议的初始偏移量
        },
    },
}
</script>
<style lang="scss" scoped>
.map-box {
    width: 100%;
    height: 100%;
    #cesiumContainer {
        width: 100%;
        height: 100%;
    }
}
</style>
