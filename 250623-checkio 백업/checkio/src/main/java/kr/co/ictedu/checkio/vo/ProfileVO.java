package kr.co.ictedu.checkio.vo;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProfileVO {
	private SawonVO profile;
	private List<SaAttachVO> fileList;
}
