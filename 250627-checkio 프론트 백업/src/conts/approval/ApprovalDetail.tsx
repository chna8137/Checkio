import React, { useEffect, useState } from 'react'
import style from './approval2.module.css'
import { Link } from 'react-router-dom'

interface workData {
  num?: number;
  sort: string;
  req: string;
  emp: string;
  boss: string;
  submitdate?: string;
  expdate?: string;
}

const ApprovalDetail: React.FC = () => {
  const [upboardList, setUpboardList] = useState<workData>();
  useEffect(() => {
    try {
      const response = { num: 1, sort: '휴가/병가', req: '조퇴 신청', emp: '이병장', boss: '이중사', state: '승인됨', submitdate: '2025.05.28', expdate: '2025.06.04' }
      // const response = await axios.get('http://192.168.0.29/myictstudy0521/upboard/detail',{params:{num:num}});
      console.log(response);
      setUpboardList(response);
    } catch (error) {
      console.error("data UpLoad Failed" + error)
    }


  }, [])
  return (
    <div>
      <div className={style.container}>
        <h2>상세내용</h2>
        <table className={style.boardTable}>
          <tbody>
            <tr>
              <th style={{ minWidth: '100px' }}>요청형식</th><td>{upboardList?.sort}</td>
            </tr>
            <tr>
              <th style={{ minWidth: '100px' }}>신청자</th><td>{upboardList?.emp}</td>
            </tr>
            <tr>
              <th style={{ minWidth: '100px' }}>게시일</th><td>{upboardList?.submitdate}</td>
            </tr>
            <tr>
              <th style={{ minWidth: '100px' }}>결재 기한</th><td>{upboardList?.expdate}</td>
            </tr>
            <tr>
              <th style={{ minWidth: '100px' }}>상세내용</th><td><iframe title="iframe" src="https://template.tiptap.dev/preview/templates/simple" className="w-full h-[70vh] md:h-124" id="iFrameResizer1" scrolling="no" style={{ width: '800px', height: '250px', overflow: 'hidden' }}></iframe></td>
            </tr>
            <tr>
              {/* <th style={{minWidth:'100px'}}>첨부파일</th><td><img src={`${imageBasePath}${upboardList?.imgn}`}/></td> */}
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2} >
                {/* <button className={style.button} onClick={updelBoard}>삭제</button> */}
                <Link to="/management" className={style.button}>목록</Link>
              </td>
            </tr>
          </tfoot>
        </table>
        <hr />
      </div>
    </div>
  )
}

export default ApprovalDetail