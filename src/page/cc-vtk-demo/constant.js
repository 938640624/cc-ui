// 多模型name数组
export const COLOR_PROPERTIES = [
    {
        name: '- Red',
        properties: { color: [1, 0.6, 0.6] },
    },
    {
        name: 'Edge - Red',
        properties: { edgeVisibility: true, color: [1, 0.6, 0.6] },
    },
    {
        name: '- Blue',
        properties: { color: [0.6, 0.6, 1] },
    },
    {
        name: 'Edge - Green',
        properties: { edgeVisibility: true, color: [0.6, 1, 0.6] },
    },
    {
        name: '- Green',
        properties: { color: [0.6, 1, 0.6] },
    },
    {
        name: 'Edge - Blue',
        properties: { edgeVisibility: true, color: [0.6, 0.6, 1] },
    },
]

export const COLORS = [
    [0.2, 0.2, 0.2],
    [0.4, 0.2, 0.3],
    [0.2, 0.4, 0.3],
    [0.6, 0.6, 0.6],
    [0.2, 0.4, 0.4],
    [0.3, 0.4, 0.2],
    [0.3, 0.2, 0.4],
]

export const VIEW_COLORS = [
    [1, 0, 0], // 矢状面
    [0, 1, 0], // coronal 冠状图
    [0, 0, 1], // axial 轴向图
    [0.5, 0.5, 0.5], // 3D图
]
