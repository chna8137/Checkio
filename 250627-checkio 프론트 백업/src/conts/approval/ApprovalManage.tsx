import React, { useEffect, useState } from 'react'
import style from './approval2.module.css'
import styles from './approval1.module.css'
import { Link, useNavigate } from 'react-router-dom'

const ApprovalManage: React.FC = () => {
  const workData = [  
    { num: 1, sort: '휴가/병가', req: '휴가 신청', emp: '이상병', boss: '이중사', state: '미승인', submitdate: '2025.05.21', expdate: '2025.05.28' },
    { num: 2, sort: '초과근무', req: '프로젝트 결재', emp: '이상병', boss: '이중사', state: '미승인', submitdate: '2025.05.23', expdate: '2025.05.30' },
    { num: 3, sort: '지각/조퇴', req: '조퇴 신청', emp: '응애', boss: '이중사', state: '미승인', submitdate: '2025.05.21', expdate: '2025.05.28' },

  ]
  const tripData = [
    { num: 1, sort: '출장', req: '출장 신청', emp: '이상병', boss: '이중사', state: '미승인', submitdate: '2025.05.21', expdate: '2025.05.28' },
    { num: 2, sort: '출장', req: '출장 신청', emp: '이병장', boss: '이중사', state: '미승인', submitdate: '2025.05.28', expdate: '2025.06.04' }
  ]
  const tripOkData = [
    { num: 1, sort: '출장', req: '출장 신청', emp: '이상병', boss: '이중사', state: '승인됨', submitdate: '2025.05.21', expdate: '2025.05.28' },
    { num: 2, sort: '출장', req: '출장 신청', emp: '이병장', boss: '이중사', state: '승인됨', submitdate: '2025.05.28', expdate: '2025.06.04' }
  ]

  const workOkData = [
    { num: 1, sort: '휴가/병가', req: '조퇴 신청', emp: '이병장', boss: '이중사', state: '승인됨', submitdate: '2025.05.28', expdate: '2025.06.04' },
    { num: 2, sort: '초과근무', req: '기타 결재', emp: '이병장', boss: '이중사', state: '승인됨', submitdate: '2025.05.22', expdate: '2025.05.30' },
  ]

  const approvalData = ['휴가/병가', '출장', '지각/조퇴', '초과근무']

  const [isOpen, setIsOpen] = useState(false);                  //전환 드랍다운
  const toggleDropdown = () => { setIsOpen((prev) => !prev) };  //전환 드랍다운 관리
  const closeDropdown = () => { setIsOpen(false) };             //전환 내의 div 누르면 닫히는 기능
  const [searchValue, setSearchValue] = useState('1');          //전환 내의 div useState
  const [approval, setApproval] = useState('휴가/병가');         //전환 내의 div 누르면 리스트 데이터가 보이는 기능
  const [boxselect,setBoxselect] = useState<number[]>([]);      //결재하지 않은 리스트들을 선택한 아이들
  const [data, setData] = useState(workData);                   //바꿀 데이터 행들을 컨트롤 하기 위한 useState

  const linkClass = (approvalData: string) => approval === approvalData ? `${styles.link} ${styles.active}` : styles.link;
  const stateClass = (state: string) => state === '미승인' ? styles.no : styles.ok;
  const boxClass = (f : number) => boxselect.includes(f) ? style.boxchecked : '';

  const navigate = useNavigate();

  const handleCheckboxChange = (id: number, checked: boolean) => {      //체크박스 선택 주요기능
  if (checked) {
    setBoxselect(prev => [...prev, id]);  // 추가
  } else {
    setBoxselect(prev => prev.filter(item => item !== id));  // 제거
  }
};

  const updateCheckedbox = (boxselect: number[], newState: string) => {   
    setData(e =>  e.map(f =>
       boxselect.includes(f.num) ? { ...f, state: newState } : f
      )
    );
  };
  useEffect(() => {             //선택된 박스들을 useEffect로!
    console.log(boxselect);
  }, [boxselect])

  const buttonClick1 = () => {  //서류작성폼 이동버튼
    navigate('/management/form');
  }
  const buttonClick2 = () => {  //선택승인버튼. 선택돈 박스들을 승인 시키는 기능
    updateCheckedbox(boxselect,'승인됨');
    const states = data.map(item => item.state);
    console.log(states);
    console.log('승인됨');
    
  }

  return (
    <div className={style.container}>
      <h2>결재 차트</h2>
      <div className={styles.navbar}>
        {approvalData.map((e) => (
          <div key={e} className={linkClass(e)} onClick={() => setApproval(e)}>{e}</div>
        ))}</div>
      <div className={styles.dropdown}>
        <div onClick={toggleDropdown} className={styles.link}>
          전환 <span className={styles.arrow}>{isOpen ? '◀' : '▶'}</span>
        </div>
        {isOpen && (
          <div className={styles.dropdownContent}>
            <div className={styles.dropdownList} onClick={() => { setSearchValue('1'); closeDropdown(); }}>결재리스트</div>
            <div className={styles.dropdownList} onClick={() => { setSearchValue('2'); closeDropdown(); }}>승인리스트</div>
          </div>
        )}
      </div>
      {approval === '휴가/병가' &&
        <table className={style.boardTable}>
          <thead></thead>
          <tbody>

            {searchValue === '1' && (<>
              <tr><th colSpan={8}> 이하사 - 결재리스트 </th></tr>
              <tr><th>선택</th><th>구분</th><th>요청형태</th><th>신청자</th><th>결재권자</th><th>승인/제출 상태</th><th>게시일</th><th>결재기한</th></tr>
              {workData.map((e) =>
                <tr className={boxClass(e.num)} key={e.num}>
                  <td><input type="checkbox" onChange={((f)=> handleCheckboxChange(e.num,f.target.checked))}/></td>
                  <td>{e.req}</td>
                  <td><Link to={`/management/${e.num}`}>{e.req}</Link></td>
                  <td>{e.emp}</td>
                  <td>{e.boss}</td>
                  <td><div className={stateClass(e.state)}>{e.state}</div></td>
                  <td>{e.submitdate}</td>
                  <td>{e.expdate}</td>
                </tr>

              )}
              <tr><td colSpan={4}><button onClick={buttonClick1} className={style.button}>서류작성</button></td><td colSpan={4}><button className={style.button} onClick={buttonClick2}>선택 승인</button></td></tr>
            </>)}
            {searchValue === '2' && (<>
              <tr><th colSpan={7}> 이하사 - 승인리스트 </th></tr>
              <tr><th>구분</th><th>요청형태</th><th>신청자</th><th>결재권자</th><th>승인/제출 상태</th><th>게시일</th><th>결재기한</th></tr>
              {workOkData.map((e) =>
                <tr key={e.num}>
                  <td>{e.sort}</td>
                  <td><Link to={`/management/${e.num}`}>{e.req}</Link></td>
                  <td>{e.emp}</td>
                  <td>{e.boss}</td>
                  <td><div className={stateClass(e.state)}>{e.state}</div></td>
                  <td>{e.submitdate}</td>
                  <td>{e.expdate}</td>
                </tr>
              )}
              <tr><td colSpan={8}><button onClick={buttonClick1} className={style.button}>서류작성</button></td></tr>
            </>)}

          </tbody>
          <tfoot>
          </tfoot>
        </table>
      }

      {/* ------------------------------------------------tripdata------------------------------------------------------ */}

      {approval === '출장' &&
        <table className={style.boardTable}>
          <thead></thead>
          <tbody>
            {searchValue === '1' && (<>
              <tr><th colSpan={8}> 이하사 - 결재리스트 </th></tr>
              <tr><th>선택</th><th>구분</th><th>요청형태</th><th>신청자</th><th>결재권자</th><th>승인/제출 상태</th><th>게시일</th><th>결재기한</th></tr>
              {tripData.map((e) =>
                <tr key={e.num}>
                  <td><input type="checkbox"/></td>
                  <td>{e.sort}</td>
                  <td><Link to={`/management/${e.num}`}>{e.req}</Link></td>
                  <td>{e.emp}</td>
                  <td>{e.boss}</td>
                  <td><div className={stateClass(e.state)}>{e.state}</div></td>
                  <td>{e.submitdate}</td>
                  <td>{e.expdate}</td>
                </tr>
              )}
              <tr><td colSpan={4}><button onClick={buttonClick1} className={style.button}>서류작성</button></td><td colSpan={4}><button className={style.button} onClick={buttonClick2}>선택 승인</button></td></tr>
            </>)}
            {searchValue === '2' && (<>
              <tr><th colSpan={7}> 이하사 - 승인리스트 </th></tr>
              <tr><th>구분</th><th>요청형태</th><th>신청자</th><th>결재권자</th><th>승인/제출 상태</th><th>게시일</th><th>결재기한</th></tr>
              {tripOkData.map((e) =>
                <tr key={e.num}>
                  <td>{e.sort}</td>
                  <td><Link to={`/management/${e.num}`}>{e.req}</Link></td>
                  <td>{e.emp}</td>
                  <td>{e.boss}</td>
                  <td><div className={stateClass(e.state)}>{e.state}</div></td>
                  <td>{e.submitdate}</td>
                  <td>{e.expdate}</td>
                </tr>
              )}
              <tr><td colSpan={8}><button onClick={buttonClick1} className={style.button}>서류작성</button></td></tr>
            </>)}
          </tbody>
          <tfoot>
          </tfoot>
        </table>
      }
    </div>
  )
}

export default ApprovalManage;