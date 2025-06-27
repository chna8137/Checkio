package kr.co.ictedu.checkio.dao;

import org.apache.ibatis.annotations.Mapper;

import kr.co.ictedu.checkio.vo.SaAttachVO;

@Mapper
public interface SaAttachDao {
	
	void addImg(SaAttachVO svo);
	
	SaAttachVO getAttachByUid(int sa_att_uid);
//	void updateSaAttach(SaAttachVO svo);

}
