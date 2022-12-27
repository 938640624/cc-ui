import Home from '../views/Home.vue'

// import Loading from '../page/cc-loading/cc-loading.vue'
import Loading from '@/page/basic/cc-loading/index.vue'
import StartEndTime from '@/page//basic/cc-start-end-time/index.vue'

import Toast from '../page/cc-toast/cc-toast.vue'
import ActionSheet from '../page/cc-action-sheet/cc-action-sheet.vue'

import IndexList from '../page/cc-scroll-indexlist/index.vue'

import IndexTable from '../page/cc-index-demo/cc-index-table.vue'
import FullTable from '../page/cc-index-demo/cc-full-table.vue'
import ElementTable from '../page/cc-index-demo/cc-element-table.vue'
import DragMove from '../page/cc-index-demo/cc-drag-move.vue'
import EchartBrokenLine from '../page/cc-index-demo/cc-echart-broken-line.vue'
import EchartSwitch from '../page/cc-index-demo/cc-echart-switch.vue'
import EchartType from '../page/cc-index-demo/cc-echart-type.vue'
import AnimationAll from '../page/cc-index-demo/cc-animation-all.vue'
import ColorEditor from '../page/cc-index-demo/cc-color-editor.vue'
import IndexUtils from '../page/cc-index-demo/cc-index-utils.vue'
import ProgressBar from '../page/cc-progress-bar/progress-bar.vue'

import TextKtv from '../page/cc-css-demo/cc-text-ktv.vue'
import Spotlight from '../page/cc-css-demo/cc-spotlight.vue'
import MouseWizard from '../page/cc-css-demo/cc-mouse-wizard.vue'

import CanvasAlipay from '../page/cc-canvas/cc-alipay.vue'
import CanvasColorMouse from '../page/cc-canvas/cc-color-mouse.vue'

import HighLight from '../page/cc-threejs-demo/cc-highlight.vue'
import CodeMirror from '../page/cc-index-demo/cc-code-mirror.vue'
import Marker from '../page/cc-threejs-demo/cc-marker.vue'
import ComplexEffect from '../page/cc-index-demo/cc-complex-effect.vue'
import LatheModel from '../page/cc-threejs-demo/cc-lathe-model.vue'
import PlaneModel from '../page/cc-threejs-demo/cc-plane-model.vue'
import ClipIntersection from '../page/cc-threejs-demo/cc-clip-intersection.vue'
import LocalClipping from '../page/cc-threejs-demo/cc-local-clipping.vue'
import ExpertClipping from '../page/cc-threejs-demo/cc-expert-clipping.vue'
import ClipAdvanced from '../page/cc-threejs-demo/cc-clip-advanced.vue'

import ModelMove from '../page/cc-cesium-demo/cc-model-move.vue'
import TankModel from '../page/cc-cesium-demo/cc-tank-model.vue'
import Mars3dCirclewave from '../page/cc-cesium-demo/cc-mars3d-circlewave.vue'

import BasicModel from '@/page/cc-vtk-demo/cc-basic-model.vue'
import ItkModel from '@/page/cc-vtk-demo/cc-itk-model.vue'
import MoreRenderer from '@/page/cc-vtk-demo/cc-more-renderer.vue'
import XYZRenderer from '@/page/cc-vtk-demo/cc-xyz-renderer.vue'
import CbctRenderer from '@/page/cc-vtk-demo/cc-cbct-renderer.vue'
import AxisRotateModel from '@/page/cc-vtk-demo/cc-axis-rotate-model.vue'

import BasicAmap from '@/page/cc-Amap-demo/cc-Amap-basic.vue'
const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },

    {
        path: '/loading',
        name: 'Loading',
        component: Loading,
    },
    {
        path: '/start-end-time',
        name: 'StartEndTime',
        component: StartEndTime,
    },

    {
        path: '/toast',
        name: 'Toast',
        component: Toast,
    },
    {
        path: '/action-sheet',
        name: 'ActionSheet',
        component: ActionSheet,
    },

    {
        path: '/index-list',
        name: 'IndexList',
        component: IndexList,
    },

    {
        path: '/index-table',
        name: 'IndexTable',
        component: IndexTable,
    },
    {
        path: '/full-table',
        name: 'FullTable',
        component: FullTable,
    },
    {
        path: '/element-table',
        name: 'ElementTable',
        component: ElementTable,
    },
    {
        path: '/drag-move',
        name: 'DragMove',
        component: DragMove,
    },
    {
        path: '/echart-broken-line',
        name: 'EchartBrokenLine',
        component: EchartBrokenLine,
    },
    {
        path: '/echart-switch',
        name: 'EchartSwitch',
        component: EchartSwitch,
    },
    {
        path: '/echart-type',
        name: 'EchartType',
        component: EchartType,
    },
    {
        path: '/animation-all',
        name: 'AnimationAll',
        component: AnimationAll,
    },
    {
        path: '/color-editor',
        name: 'ColorEditor',
        component: ColorEditor,
    },
    {
        path: '/index-utils',
        name: 'IndexUtils',
        component: IndexUtils,
    },
    {
        path: '/progress-bar',
        name: 'ProgressBar',
        component: ProgressBar,
    },

    {
        path: '/text-ktv',
        name: 'TextKtv',
        component: TextKtv,
    },
    {
        path: '/spotlight',
        name: 'Spotlight',
        component: Spotlight,
    },
    {
        path: '/mouse-wizard',
        name: 'MouseWizard',
        component: MouseWizard,
    },

    {
        path: '/canvas-alipay',
        name: 'CanvasAlipay',
        component: CanvasAlipay,
    },
    {
        path: '/canvas-color-mouse',
        name: 'CanvasColorMouse',
        component: CanvasColorMouse,
    },

    {
        path: '/code-mirror',
        name: 'CodeMirror',
        component: CodeMirror,
    },
    {
        path: '/complex-effect',
        name: 'ComplexEffect',
        component: ComplexEffect,
    },
    {
        path: '/highlight',
        name: 'HighLight',
        component: HighLight,
    },
    {
        path: '/marker',
        name: 'Marker',
        component: Marker,
    },
    {
        path: '/lathe-model',
        name: 'LatheModel',
        component: LatheModel,
    },
    {
        path: '/plane-model',
        name: 'PlaneModel',
        component: PlaneModel,
    },
    {
        path: '/local-clipping',
        name: 'LocalClipping',
        component: LocalClipping,
    },
    {
        path: '/expert-clipping',
        name: 'ExpertClipping',
        component: ExpertClipping,
    },
    {
        path: '/clip-intersection',
        name: 'ClipIntersection',
        component: ClipIntersection,
    },
    {
        path: '/clip-advanced',
        name: 'ClipAdvanced',
        component: ClipAdvanced,
    },

    {
        path: '/model-move',
        name: 'ModelMove',
        component: ModelMove,
    },
    {
        path: '/tank-model',
        name: 'TankModel',
        component: TankModel,
    },
    {
        path: '/mars3d-circlewave',
        name: 'Mars3dCirclewave',
        component: Mars3dCirclewave,
    },

    {
        path: '/basic-model',
        name: 'BasicModel',
        component: BasicModel,
    },
    {
        path: '/itk-model',
        name: 'ItkModel',
        component: ItkModel,
    },
    {
        path: '/more-renderer',
        name: 'MoreRenderer',
        component: MoreRenderer,
    },
    {
        path: '/xyz-renderer',
        name: 'XYZRenderer',
        component: XYZRenderer,
    },
    {
        path: '/cbct-renderer',
        name: 'CbctRenderer',
        component: CbctRenderer,
    },
    {
        path: '/axis-rotate-model',
        name: AxisRotateModel,
        component: AxisRotateModel,
    },

    {
        path: '/basic-Amap',
        name: 'BasicAmap',
        component: BasicAmap,
    },
]

export default routes
