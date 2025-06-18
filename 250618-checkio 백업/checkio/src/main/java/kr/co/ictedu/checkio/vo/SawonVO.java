package kr.co.ictedu.checkio.vo;

import java.util.List;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Alias("savo")
public class SawonVO {
	
	private int sa_uid;
	private String reg_id; // 사용자 id
	private String reg_date;
	private String mod_id;
	private String mod_date;
	private String status; // 상태 승인여부(Y/N)
	private String user_name; // 직원의 이름
	private String user_id; // 근태 관리 시스템 사용자 ID
	private String PASSWORD; // 근태관리시스템 사용자 password
	private String join_date; // 입사 일자
	private String tel_no; // 직통번호
	private String phone_no; // 핸드폰 번호
	private String email; // 이메일 주소
	private String zipcode; // 우편 번호
	private String address1; // 주소
	private String address2; // 상세 주소
	private String gender; // 성별
	private String birthdate; // 생년월일
	private String position; // 직위
	private String emp_num; // 사원번호(입사일자 + 번호)
	private String profileImage; // 프로필 이미지
	private int dept_no; // fk - 부서번호
	private int auth_uid; // fk
	
	private String dept_name;
	private String SA_FILE_PATH;
	
	private List<SaAttachVO> getimglist;
	

	

}
