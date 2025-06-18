package kr.co.ictedu.checkio.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.ictedu.checkio.vo.SaAttachVO;
import kr.co.ictedu.checkio.vo.SawonVO;

@Mapper
public interface ProfileDao {
	
	List<SawonVO> profile();
	
	void addImg(List<SaAttachVO> svo);
	
	void updateProfile(SawonVO vo);

}
