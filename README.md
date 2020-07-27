## 介绍
根据 Engineerning 文档写的 Autocomplete 组件
目前写了简单的样式，抽象了几个简单常用的 API

## API
| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| disabled | 是否禁用 | boolean | false |  |
| placeholder | 输入框提示 | string | - |  |
| value | 指定当前选中的条目 | string | 无 |  |
| onBlur | 失去焦点时的回调 | function() | - |  |
| onFocus | 获得焦点时的回调 | function() | - |  |
| onChange | 选中 option，或 input 的 value 变化时，调用此函数 | function(value) | 无 |  |
| onSearch | 搜索补全项的时候调用 | function(value) | 无 |  |
| onSelect | 被选中时调用，参数为选中项的 value 值 | function(value, option) | 无 |  |

## 启动项目
```bash
npm install # 下载依赖
npm start # 启动项目
```

### 运行测试
```bash
npm test # 运行测试
```
