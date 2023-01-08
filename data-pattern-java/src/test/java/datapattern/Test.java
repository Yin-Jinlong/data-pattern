package datapattern;

import com.github.yinjinlong.datapattern.DataPattern;

public class Test {
	
	public static void main(String[] args) {
		DataPattern.loadDataFiles();
		System.out.println("手机号:");
		System.out.println(DataPattern.isPhonePattern("18712345678"));
		System.out.println(DataPattern.isPhonePattern("19412345678"));
		System.out.println(DataPattern.isPhonePattern("+86 18712345678"));
		System.out.println("邮箱:");
		System.out.println(DataPattern.isEmail("aaa@test.cn"));
		//身份证号隐私，已经测试通过
		
		
	}
	
}
