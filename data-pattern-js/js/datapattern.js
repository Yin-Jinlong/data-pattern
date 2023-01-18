/**
 * DataPattern
 * @type {{
 * isPhone(string):boolean,
 * isEmail(string):boolean,
 * isIdNumber(string):boolean,
 * formatNumber(number|string,number,number,string):string}}
 */
const DT = (() => {
    const suffixes = ['com', 'net', 'cn', 'info', 'xin', 'club', 'xyz', 'ltd', 'co', 'wang', 'top', 'vip', 'beer', 'art', 'cloud', 'site', 'shop', 'fun', 'link', 'online', 'tech', 'ren', 'luxe', 'pro', 'kim', 'work', 'red', 'ink', 'group', 'store', 'host', 'pub', 'live', 'wiki', 'design', 'video', 'fit', 'yoga', 'biz', 'org', 'name', 'cc', 'tv', 'mobi', 'asia', '在线', '网址', '网店', '商城', '中文网', '公司', '网络', '我爱你', '餐厅', '中国', '中国', '集团', 'com', 'cn', 'net', 'cc', 'biz', '公司', '网络', 'bid', 'loan', 'click', 'gift', 'pics', 'photo', 'men', 'pw', 'news', 'win', 'party', 'date', 'trade', 'science', 'website', 'space', 'press', 'rocks', 'band', 'engineer', 'market', 'social', 'software', 'lawyer', 'studio', 'mom', 'lol', 'game', 'games', 'help', 'me', 'vc', 'so', 'tel', 'hk', 'hk', '商标', 'love', 'plus', 'today', 'gold', 'city', 'show', 'run', 'world', 'icu', '广东', '佛山', 'life', '招聘', 'fans', 'bar', 'cool', '游戏', 'zone', '购物', 'law', 'fund', 'email', 'team', 'center', 'guru'];
    return {
        /**
         * 是否为电话号码（国内）
         * @param text{string} 待验证文本
         * @returns {boolean} 是否匹配手机号
         * @example 正常使用
         * DT.isPhone('18812345678')//true
         * DT.isPhone('+8619411112222')//false 没有194开头的号
         */
        isPhone(text) {
            let r = /(\+(00)?86 ?)?1([38][0-9]|4[57]|[59][0-35-9]|6[25-7]|7[0135-8]) ?\d{4} ?\d{4}/.exec(text);
            return r ? r[0] === text : false;
        },
        /**
         * 是否为电子邮件地址
         * @param text{string} 待验证文本
         * @returns {boolean} 格式是否匹配
         * @example
         * DT.isEmail('aaa@qq.com')//true
         * DT.isEmail('aaa@139.aa')//false 没有aa域名后缀
         */
        isEmail(text) {
            let r = /\w+@\w+\.\w{2,8}/.exec(text);
            return r ? r[0] === text ? suffixes.includes(text.toLowerCase().substring(text.lastIndexOf('.') + 1)) : false : false;
        },
        /**
         * 是否为身份证号码
         * @param text{string} 待验证文本
         * @returns {boolean} 是否匹配身份证号
         */
        isIdNumber(text) {
            let r = /(\d{6})(19\d{2}|20[012]\d)(0\d|1[12])([012]\d|3[01])(\d{3})(\d|X|x)/.exec(text);
            if (!r || r[0] !== text)
                return false;
            text = text.toUpperCase();
            let sum = (+text[0] + +text[10]) * 7 +
                (+text[1] + +text [11]) * 9 +
                (+text[2] + +text [12]) * 10 +
                (+text[3] + +text [13]) * 5 +
                (+text[4] + +text [14]) * 8 +
                (+text[5] + +text [15]) * 4 +
                (+text[6] + +text [16]) * 2 +
                (+text[7]) +
                (+text[8]) * 6 +
                (+text[9]) * 3;
            sum = (12 - sum % 11) % 11;
            if (sum === 10 ? text[17] === 'X' : +text[17] === sum) {
                const year = +text.substring(6, 10);
                const month = +text.substring(11, 12);
                let date = +text.substring(13, 14);
                switch (month) {
                    case 4:
                    case 6:
                    case 9:
                    case 11:
                        if (date > 31)
                            return false;
                        break
                    case 2:
                        if (year % 100 !== 0 && year % 4 === 0) {
                            if (date > 29)
                                return false;
                        } else if (date > 28)
                            return false;
                        break
                    default:
                        if (date > 32)
                            return false;
                }
                let today = new Date(), dd = new Date();
                dd.setFullYear(year);
                dd.setMonth(month - 1);
                dd.setDate(date);
                return today.getTime() > dd.getTime() && year - today.getFullYear() < 120;
            }
            return false;
        },
        /**
         * 格式化数字（添加分隔符）
         * @param num {number|string} 待格式化数字或数字字符串
         * @param scale {number} 保留小数位
         * @param space?{number} 分割间隔（默认为3）
         * @param ss?{string} 分隔符
         * @returns {undefined|string} 结果或空（参数为空）
         * @example
         * DT.formatNumber(1234567.1234,7)//1,234,567.123,400,0
         * DT.formatNumber('12345',0,4,'_')//1_2345
         */
        formatNumber(num, scale, space = 3, ss = ',') {
            if (!num || !ss || ss.length < 1 || scale < 0 || space < 0)
                return num;
            num = num.toString();
            if (/\d+\.?\d+/.exec(num).toString() !== num)
                return num;
            let z = num, x = '', index = num.indexOf('.');
            if (index > 1) {
                z = num.substring(0, index);
                x = num.substring(index + 1);
            }
            x = x.padEnd(scale, '0');
            return z.replaceAll(new RegExp('(?=\\B(\\d{' + space + '})+$)', 'g'), ss) +
                (scale === 0 ? '' : '.' + x.replaceAll(new RegExp('(?<=^(\\d{' + space + '})+\\B)', 'g'), ss));
        }
    };
})()