package com.github.yinjinlong.datapattern;


import com.sun.istack.internal.NotNull;
import com.sun.istack.internal.Nullable;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Calendar;
import java.util.HashSet;
import java.util.Properties;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

/**
 *
 */
public final class DataPattern {
	
	static boolean loaded = false;
	
	/**
	 * 国内手机号
	 * <p>
	 * 时间 => 2022
	 */
	static final Pattern phone;
	
	/**
	 * 身份证号预格式，大概格式，不一定正确
	 */
	static final Pattern idNum_pre_pattern;
	
	/**
	 * 邮箱格式
	 */
	static final Pattern email;
	
	/**
	 * 身份证行政区划代码集合，至1980起
	 */
	private static final Properties idReginMappings = new Properties();
	
	/**
	 * 域名后缀，邮箱要满足
	 */
	private static final Set<String> name_suffixes = new HashSet<>(150);
	
	/**
	 * 格式数字
	 *
	 * @param n     数字
	 * @param scale 保留小数位
	 * @return 格式结果或null
	 */
	public static String formatNumber(Number n, int scale) {
		return formatNumber(n, 3, ",", scale);
	}
	
	/**
	 * 格式数字，分组
	 *
	 * @param n     数字
	 * @param space 间隔，通常为3
	 * @param ss    分隔符
	 * @param scale 保留小数位
	 * @return 格式后字符串或null（包含非数字）
	 */
	@Nullable
	public static String formatNumber(@NotNull Number n, final int space, @NotNull final String ss, int scale) {
		if (n == null || space < 1 || scale < 0 || ss == null)
			return null;
		String num = n.toString();
		if (!num.matches("\\d+\\.?\\d+"))
			return num;
		String        z = num;
		StringBuilder x = new StringBuilder();
		if (num.contains(".")) {
			z = num.substring(0, num.indexOf("."));
			x.append(num.substring(num.indexOf(".") + 1));
		}
		if (x.length() < scale)
			while (x.length() < scale)
				x.append('0');
		else
			x.setLength(scale);
		//noinspection RegExpSimplifiable
		return z.replaceAll("(?=\\B(\\d{" + space + "})+$)", ss) + (scale == 0 ? "" : "." + x.toString().replaceAll("(?<=^(\\d{" + space + "})+\\B)", ss));
	}
	
	
	/**
	 * 是否为身份证号（大致格式）
	 * <p>精确模式请使用{@link #getIDNumberLocation(CharSequence)}</p>
	 *
	 * @param text 要匹配的字符串
	 * @return 匹配结果，成功为true否则false
	 */
	@SuppressWarnings("MagicConstant")
	public static boolean isIDNumber(@Nullable CharSequence text) {
		if (text == null || !idNum_pre_pattern.matcher(text).matches())
			return false;
		text = text.toString().toUpperCase();
		int sum = (text.charAt(0) + text.charAt(10) - 96) * 7 +
		          (text.charAt(1) + text.charAt(11) - 96) * 9 +
		          (text.charAt(2) + text.charAt(12) - 96) * 10 +
		          (text.charAt(3) + text.charAt(13) - 96) * 5 +
		          (text.charAt(4) + text.charAt(14) - 96) * 8 +
		          (text.charAt(5) + text.charAt(15) - 96) * 4 +
		          (text.charAt(6) + text.charAt(16) - 96) * 2 +
		          (text.charAt(7) - '0') +
		          (text.charAt(8) - '0') * 6 +
		          (text.charAt(9) - '0') * 3;
		sum = (12 - sum % 11) % 11;
		if (sum == 10 ? text.charAt(17) == 'X' : text.charAt(17) - '0' == sum) {
			int year  = Integer.parseInt(text.subSequence(6, 10).toString());
			int month = Integer.parseInt(text.subSequence(11, 12).toString());
			int date  = Integer.parseInt(text.subSequence(13, 14).toString());
			switch (month) {
				case 2:
					if (year % 100 != 0 && year % 4 == 0) {
						if (date > 29)
							return false;
					} else if (date > 28)
						return false;
					break;
				case 4:
				case 6:
				case 9:
				case 11:
					if (date > 31)
						return false;
					break;
				default:
					if (date > 32)
						return false;
			}
			Calendar today = Calendar.getInstance(), cal = Calendar.getInstance();
			cal.set(year, month - 1, date);
			return today.after(cal) && year - today.get(Calendar.YEAR) < 120;
		}
		return false;
	}
	
	/**
	 * 是否为邮箱格式
	 *
	 * @param text 要匹配的字符串
	 * @return 匹配结果，成功为true否则false
	 */
	public static boolean isEmail(@Nullable CharSequence text) {
		if (text == null || !email.matcher(text).matches())
			return false;
		String suffix = text.toString();
		return name_suffixes.contains(suffix.substring(suffix.lastIndexOf(".") + 1).toLowerCase());
	}
	
	/**
	 * 是否为手机号格式
	 *
	 * @param text 要匹配的字符串
	 * @return 匹配结果，成功为true否则false
	 */
	public static boolean isPhonePattern(@Nullable CharSequence text) {
		return text != null && phone.matcher(text.toString().replaceAll("\\s", "")).matches();
	}
	
	/**
	 * 获取身份证号归属地
	 *
	 * @param text 要匹配的字符串
	 * @return 匹配结果，成功地区名称数组（按范围排序，由大到小。港澳台地区暂不支持）为否则null
	 */
	@Nullable
	public static String[] getIDNumberLocation(@Nullable CharSequence text) {
		if (!isIDNumber(text))
			return null;
		if (!loaded)
			throw new RuntimeException("Data file not loaded!");
		String qy = text.subSequence(0, 6).toString();
		if (qy.endsWith("00"))
			return null;
		
		//省
		String s = idReginMappings.getProperty(qy.substring(0, 2) + "0000");
		if (s == null)
			return null;
		if (s.endsWith("省")) {
			if (s.equals("台湾省"))
				return new String[]{"台湾省"};
			//地级市
			String d = idReginMappings.getProperty(qy.substring(0, 4) + "00");
			if (d == null)
				return null;
			//县区
			String xq = idReginMappings.getProperty(qy);
			if (xq == null)
				return null;
			return new String[]{s, d, xq};
		} else if (s.endsWith("市")) {
			//县区
			String xq = idReginMappings.getProperty(qy);
			if (xq == null)
				return null;
			return new String[]{s, xq};
		} else
			return new String[]{s};
	}
	
	
	/**
	 * 加载数据文件
	 * <p>不加载也能使用部分，该操作为耗时操作，单独提取</p>
	 */
	public static void loadDataFiles() {
		if (loaded)
			return;
		ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
		InputStream inputStream = classLoader.getResourceAsStream("data-pattern/id-num-data.zip");
		if (inputStream == null)
			throw new RuntimeException("Can't read file:data-pattern/id-num-data.zip");
		try (ZipInputStream in = new ZipInputStream(inputStream)) {
			ZipEntry next;
			while ((next = in.getNextEntry()) != null) {
				String name = next.getName();
				if (!name.matches("xzqhdm-1980-20\\d\\d.ini"))
					continue;
				idReginMappings.load(new InputStreamReader(in));
				break;
			}
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
		inputStream = classLoader.getResourceAsStream("data-pattern/name-suffix.zip");
		if (inputStream == null)
			throw new RuntimeException("Can't read file:data-pattern/name-suffix.zip");
		try (ZipInputStream in = new ZipInputStream(inputStream)) {
			ZipEntry next;
			while ((next = in.getNextEntry()) != null) {
				if (!(next.getName().matches("name-suffix.txt")))
					continue;
				BufferedReader reader = new BufferedReader(new InputStreamReader(in));
				String         line;
				while ((line = reader.readLine()) != null)
					if (line.length() > 0)
						name_suffixes.add(line);
			}
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
		loaded = true;
	}
	
	static {
		phone = Pattern.compile("(\\+(00)?86)?1([38][0-9]|4[57]|[59][0-35-9]|6[25-7]|7[0135-8])\\d{8}");
		idNum_pre_pattern = Pattern.compile("(\\d{6})(19\\d{2}|20[012]\\d)(0\\d|1[12])([012]\\d|3[01])(\\d{3})(\\d|X|x)");
		email = Pattern.compile("\\w+@\\w+\\.\\w{2,8}");
	}
	
	/**
	 * <big style="color:red">仅限静态使用</big>
	 */
	private DataPattern() {
		throw new UnsupportedOperationException();
	}
	
}