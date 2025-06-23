package kr.co.ictedu.checkio.vo;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Alias("saattvo")
public class SaAttachVO {
	
	private int sa_att_uid;
	private String sa_reg_id;
	private String sa_reg_date;
	private String sa_mod_id;
	private String sa_mod_date;
	private String sa_file_name;
	private String sa_file_path;
	private int sa_source_id;

}
