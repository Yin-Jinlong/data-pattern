// noinspection JSUnusedGlobalSymbols,ES6ConvertVarToLetConst

const DT = (() => {
    const suffixes = ["com", "net", "cn", "info", "xin", "club", "xyz", "ltd", "co", "wang", "top", "vip", "beer", "art", "cloud", "site", "shop", "fun", "link", "online", "tech", "ren", "luxe", "pro", "kim", "work", "red", "ink", "group", "store", "host", "pub", "live", "wiki", "design", "video", "fit", "yoga", "biz", "org", "name", "cc", "tv", "mobi", "asia", "在线", "网址", "网店", "商城", "中文网", "公司", "网络", "我爱你", "餐厅", "中国", "中国", "集团", "com", "cn", "net", "cc", "biz", "公司", "网络", "bid", "loan", "click", "gift", "pics", "photo", "men", "pw", "news", "win", "party", "date", "trade", "science", "website", "space", "press", "rocks", "band", "engineer", "market", "social", "software", "lawyer", "studio", "mom", "lol", "game", "games", "help", "me", "vc", "so", "tel", "hk", "hk", "商标", "love", "plus", "today", "gold", "city", "show", "run", "world", "icu", "广东", "佛山", "life", "招聘", "fans", "bar", "cool", "游戏", "zone", "购物", "law", "fund", "email", "team", "center", "guru"];
    return {
        isPhone(text) {
            var r = /(\+(00)?86 ?)?1([38][0-9]|4[57]|[59][0-35-9]|6[25-7]|7[0135-8]) ?\d{4} ?\d{4}/.exec(text);
            return r ? r[0] === text : false;
        },
        isEmail(text) {
            const r = /\w+@\w+\.\w{2,8}/.exec(text);
            return r ? r[0] === text ? suffixes.indexOf(text.toLowerCase().substring(text.lastIndexOf(".") + 1)) > -1 : false : false;
        },
        isIdNumber(text) {
            var r = /(\d{6})(19\d{2}|20[012]\d)(0\d|1[12])([012]\d|3[01])(\d{3})(\d|X|x)/.exec(text);
            if (!r || r[0] !== text)
                return false;
            text = text.toUpperCase();
            var sum = (+text[0] + +text[10]) * 7 +
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
                var date = +text.substring(13, 14);
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
                var today = new Date();
                var dd = new Date();
                dd.setFullYear(year);
                dd.setMonth(month - 1);
                dd.setDate(date);
                return today.getTime() > dd.getTime() && year - today.getFullYear() < 120;
            }
            return false;
        },
        formatNumber(num, scale, space = 3, ss = ',') {
            if (!num || !ss || ss.length < 1 || scale < 0 || space < 0)
                return num;
            num = num.toString();
            if (/\d+\.?\d+/.exec(num).toString() !== num)
                return num;
            var z = num;
            var x;
            var index = num.indexOf('.');
            if (index > 1) {
                z = num.substring(0, index);
                x = num.substring(index + 1);
            } else
                x = '0';
            if (x.length < scale)
                while (x.length < scale)
                    x += '0';
            else
                x = x.substring(0, scale);
            return z.replaceAll(new RegExp('(?=\\B(\\d{' + space + '})+$)', 'g'), ss) +
                (scale === 0 ? '' : '.' + x.replaceAll(new RegExp('(?<=^(\\d{' + space + '})+\\B)', 'g'), ss));
        }
    };
})()