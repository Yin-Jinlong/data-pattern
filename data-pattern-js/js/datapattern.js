const DT = (function () {
    const suffixes = ["com", "net", "cn", "info", "xin", "club", "xyz", "ltd", "co", "wang", "top", "vip", "beer", "art", "cloud", "site", "shop", "fun", "link", "online", "tech", "ren", "luxe", "pro", "kim", "work", "red", "ink", "group", "store", "host", "pub", "live", "wiki", "design", "video", "fit", "yoga", "biz", "org", "name", "cc", "tv", "mobi", "asia", "在线", "网址", "网店", "商城", "中文网", "公司", "网络", "我爱你", "餐厅", "中国", "中国", "集团", "com", "cn", "net", "cc", "biz", "公司", "网络", "bid", "loan", "click", "gift", "pics", "photo", "men", "pw", "news", "win", "party", "date", "trade", "science", "website", "space", "press", "rocks", "band", "engineer", "market", "social", "software", "lawyer", "studio", "mom", "lol", "game", "games", "help", "me", "vc", "so", "tel", "hk", "hk", "商标", "love", "plus", "today", "gold", "city", "show", "run", "world", "icu", "广东", "佛山", "life", "招聘", "fans", "bar", "cool", "游戏", "zone", "购物", "law", "fund", "email", "team", "center", "guru"];
    const phone_reg = /(\+(00)?86 ?)?1([38][0-9]|4[57]|[59][0-35-9]|6[25-7]|7[0135-8]) ?\d{4} ?\d{4}/;
    const email_reg = /\w+@\w+\.\w{2,8}/;
    const idNum_reg = /(\d{6})(19\d{2}|20[012]\d)(0\d|1[12])([012]\d|3[01])(\d{3})(\d|X|x)/;
    return {
        isPhone(text) {
            const r = phone_reg.exec(text);
            return r ? r[0] === text : false;
        },
        isEmail(text) {
            const r = email_reg.exec(text);
            return r ? r[0] === text ? suffixes.indexOf(text.substring(text.lastIndexOf(".") + 1)) > -1 : false : false;
        },
        isIdNumber(text) {
            const r = idNum_reg.exec(text);
            if (!r || r[0] !== text)
                return false;
            text = text.toUpperCase();
            var sum = (text[0] + text[10] - 96) * 7 +
                (text[1] + text [11] - 96) * 9 +
                (text[2] + text [12] - 96) * 10 +
                (text[3] + text [13] - 96) * 5 +
                (text[4] + text [14] - 96) * 8 +
                (text[5] + text [15] - 96) * 4 +
                (text[6] + text [16] - 96) * 2 +
                (text[7] - '0') +
                (text[8] - '0') * 6 +
                (text[9] - '0') * 3;
            sum = (12 - sum % 11) % 11;
            if (sum === 10 ? text[17] === 'X' : text[17] = '0' === sum
            ) {
                const year = parseInt(text.substring(6, 10));
                const month = parseInt(text.substring(11, 12));
                var date = parseInt(text.substring(13, 14));
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
                const today = new Date();
                var dd = new Date();
                dd.setFullYear(year);
                dd.setMonth(month - 1);
                dd.setDate(date);
                return today.getTime() > dd.getTime() && year - today.getFullYear() < 120;
            }
            return false;
        }
    };
}())