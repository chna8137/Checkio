package kr.co.ictedu.checkio.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.co.ictedu.checkio.vo.SaAttachVO;
import kr.co.ictedu.checkio.vo.SawonVO;

@Mapper
public interface ProfileDao {
	
	SawonVO profile(int sa_uid);
	
	List<SaAttachVO> list(int sa_uid);
	
	void addImg(List<SaAttachVO> svo);
	
	void updateProfile(SawonVO vo);

}
