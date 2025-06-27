import React, { useState } from 'react'
import ReactDOM from "react-dom";
import styles from './modal.module.css';

type Props = {
  open: boolean;
  onClose: VoidFunction;
};

const OvertimeModal = ({ open, onClose }: Props) => {
  const [formData, setFormData] = useState({
    startTime:'',
    endTime:'',
    content:''
  });

  if (!open) return null;

  const portalElement = document.getElementById("modal");
  if (!portalElement) return null;

  const handleChange = (e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData({...formData,[name]:value});
    }

  const handleSubmit = (e:React.FormEvent) => {
    e.preventDefault();
    if(!formData.startTime || !formData.endTime) {
      alert("시작시간과 종료시간을 모두 입력하세요");
      return;
    }
    const data = new FormData();
    data.append('startTime', formData.startTime);
    data.append('endTime', formData.endTime);
    console.log(formData.startTime+" ~ "+formData.endTime+" : "+formData.content);

    onClose();
  }

  return ReactDOM.createPortal(
    <>
      <div className={styles.overlay} />
      <div className={styles.overTimeModal} style={{display:'flex', justifyContent:'space-around'}}>
        <div><p style={{fontWeight:'bold', fontSize:'1.3rem'}}>초과근무신청</p></div>
        <form onSubmit={handleSubmit}>
            <div>
              <table className="table table-hover">
                <tbody>
                  <tr>
                    <th>
                      <label>시작시간 :</label>
                    </th>
                    <td>
                      <input type="text" name="startTime" id="startTime" placeholder="00:00" onChange={handleChange} required/>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <label>종료시간 :</label>
                    </th>
                    <td>
                      <input type="text" name="endTime" id="endTime" placeholder="00:00" onChange={handleChange} required/>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <label>신청사유 :</label>
                    </th>
                    <td>
                      <textarea name="content" id="content" style={{width:'100%', height: '100px', padding: '8px'}} onChange={handleChange} placeholder="사유" required/>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={2}>
                      <label style={{color:'red', fontSize:'0.8rem'}}>※시작시간은 휴게시간 1시간 이후 시간을 작성</label>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div>
              <button type='submit' className='btn btn-secondary'>신청</button>
              <button className='btn btn-secondary' onClick={onClose}>취소</button>
            </div>
        </form>
      </div>
    </>,
    portalElement
  )
}

export default OvertimeModal