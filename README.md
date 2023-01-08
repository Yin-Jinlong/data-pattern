# data-pattern 一个字符串格式匹配库

目前支持java和js

js版本部分功能有限制

### 目前实现功能：

- 格式化字符串 formatNumber
  - 数字分隔，保留小数位
- 判断身份证号是否合法 isIdNumber
  - 校验码及日期都做了判断
- 判断邮箱是否合法 isEmail
  - 加入了服务商域名的基本判断
- 获取身份证号地区 getIDNumberLocation
  - 仅java版
  - 港澳台地区暂缺
  - 增强型的判断

#### 示例及文档暂缺