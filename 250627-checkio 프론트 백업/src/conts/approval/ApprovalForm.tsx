import React, { useEffect, useState } from 'react'
import style from './approval2.module.css'
import { Link } from 'react-router-dom'

const ApprovalForm: React.FC = () => {
    const [preview, setPreview] = useState<string | ArrayBuffer | null>('');

    const [selectValue, setSelectValue] = useState('');

    const myid = "ICT01"

    const requestOp = ['휴가/병가', '출장', '지각/조퇴', '초과근무'];

    const handleRadioChange = (option: string) => {
        setSelectValue(option);
    };

    useEffect(() => {
        handleRadioChange(selectValue);
        console.log(selectValue);
    }, [selectValue])

    return (
        <div className={style.container}>
            <h2 className={style.title}>전자결재 신청서 작성</h2>
            <form className={style.form}>
                <table className={style.boardTable}>
                    <tbody>
                        <tr>
                            <th>구분</th>
                            <td style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                {requestOp.map((option) => (
                                    <label key={option}>
                                        <input type="radio" name='sort' onChange={() => handleRadioChange(option)} />{option}
                                    </label>
                                ))}
                            </td>
                        </tr>
                        <tr>
                            <th>요청형태</th>
                            <td><select className={style.input} name='req' id='req' disabled={!selectValue} value={selectValue} onChange={(e) => setSelectValue(e.target.value)}>
                                <option>-- 선택 --</option>
                                {selectValue === '휴가/병가' && <>
                                    <option value='휴가'>휴가 결재 신청서</option>
                                    <option value='병가'>병가 결재 신청서</option>
                                </>}
                                {selectValue === '출장' && <>
                                    <option value='출장'>출장 결재 신청서</option>
                                </>}
                                {selectValue === '지각/조퇴' && <>
                                    <option value='지각'>지각 결재 사유서</option>
                                    <option value='조퇴'>조퇴 결재 사유서</option>
                                </>}
                                {selectValue === '초과근무' && <>
                                    <option value='휴가'>초과근무 신청서</option>
                                </>}
                            </select></td>
                        </tr>
                        <tr>
                            <th>신청자</th>
                            <td><select name='writer' id='writer' className={style.input} required>
                                <option>{myid}</option>
                            </select>
                            </td>
                        </tr>
                        <tr>
                            <th>내용</th>
                            <td><iframe title="iframe" src="https://template.tiptap.dev/preview/templates/simple" className="w-full h-[70vh] md:h-124" id="iFrameResizer1" scrolling="no" style={{ width: '800px', height: '250px', overflow: 'hidden' }}></iframe></td>
                        </tr>
                        <tr>
                            <th>첨부파일</th>
                            <td><input type="file" name='mfile' id='mfile' className={style.input} /></td>
                        </tr>
                        {preview &&
                            (<tr>
                                <td colSpan={2} style={{ textAlign: 'center' }}><img src={preview as string} alt='' style={{ width: '150px', height: '150px', marginRight: '10px', marginBottom: '10px' }} /></td>
                            </tr>)
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <th colSpan={2}>
                                <button type='submit' className={style.button}>등록하기</button>
                                <Link to="/management" className={style.button} style={{ marginLeft: '10px' }}>취소</Link>
                            </th>
                        </tr>
                    </tfoot>
                </table>
            </form>
        </div>
    )
}

export default ApprovalForm