package kr.co.ictedu.checkio.vo;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Alias("deptvo")
public class DepartmentVO {

	private int dept_no;
	private String reg_id;
	private String reg_date;
	private String mod_id;
	private String mod_date;
	private String dept_name;
	private String dept_loc;
	private String dept_tel;
}
