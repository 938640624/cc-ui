<template>
    <div class="cbct-renderer-page">
        <cc-header :headtitle="'cbctRendererViews(cbct格式场景渲染)'" />
        <cc-scroll>
            <template v-if="imageData">
                <cc-cbct-view></cc-cbct-view>
            </template>
            <template v-else>
                <div class="vtk-file">
                    <input type="file" webkitdirectory directory @change="handleInputChange" />
                </div>
            </template>
        </cc-scroll>
    </div>
</template>
<script>
import ccHeader from '@/components/cc-header/cc-header.vue'
import ccScroll from '@/components/cc-scroll/cc-scroll.vue'
import ccCbctView from '@/components/cc-cbct-renderer/cc-cbct-view.vue'
import ITKHelper from '@kitware/vtk.js/Common/DataModel/ITKHelper'
import readImageDICOMFileSeries from 'itk/readImageDICOMFileSeries'
export default {
    name: 'cbct-renderer-page',
    components: {
        ccScroll,
        ccHeader,
        ccCbctView,
    },
    data() {
        return {
            imageData: null,
        }
    },
    methods: {
        async handleInputChange(e) {
            const files = e.target.files
            if (!files || !files.length) return
            // convertItkToVtkImage：将itk-wasm图像转换为vtkImageData格式
            // readImageDICOMFileSeries：从存储在Array或FileList中的一系列 DICOM File或Blob中读取图像
            const itkImage = await readImageDICOMFileSeries(files)
            const { image } = itkImage
            const { convertItkToVtkImage } = ITKHelper
            this.imageData = convertItkToVtkImage(image)
        },
    },
    provide() {
        return {
            imageData: () => this.imageData,
        }
    },
    mounted() {},
}
</script>
<style lang="scss" scoped>
.vtkDiv {
    position: relative;
    width: 100%;
    height: 100%;
}
.vtk-file {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>
