import { Link } from "react-router-dom";
import styles from './profile.module.css';
import { useEffect, useState } from "react";
import axios from "axios";
import { ckb } from "date-fns/locale";

interface ProfileVO {
  sa_uid: number,
  sa_att_uid: number,
  profileImage: string,
  user_name: string,
  dept_name: string,
  tel_no: string,
  email: string,
  position: string,
  join_date: string,
  sa_file_name: string,
  sa_file_path: string
}

export default function PersonalProfile() {

  const [profile, setProfile] = useState<ProfileVO>();
  const [imgList, setImgList] = useState<ProfileVO[]>([]);

  const imageBasePath = `http://192.168.56.1/checkio/upload/`;

  const fetchProfile = async () => {

    try {
      const response = await axios.get('http://192.168.56.1/checkio/profile/detail');

      setProfile(response.data.profile);
      setImgList(response.data.fileList);
      console.log(response.data.profile);
      console.log(response.data.profile.tel_no);
    } catch (error) {
      console.error("데이터 가져오기 실패 : " + error);

    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <form className={styles.form}>
      <div>
        <img
          src={`${imageBasePath}${profile?.profileImage}`}
          alt="프로필 이미지"
          style={{
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid #ddd",
          }}
        />
        <p style={{ margin: 0 }}><br />
          <strong>이름:</strong> {profile?.user_name}
        </p><br />
        <p style={{ margin: 0 }}>
          <strong>부서:</strong> {profile?.dept_name}
        </p><br />
        <p style={{ margin: 0 }}>
          <strong>전화번호:</strong> {profile?.tel_no}
        </p><br />
        <p style={{ margin: 0 }}>
          <strong>이메일:</strong> {profile?.email}
        </p><br />
        <p style={{ margin: 0 }}>
          <strong>직무/직급:</strong> {profile?.position}
        </p><br />
        <p style={{ margin: 0 }}>
          <strong>입사일:</strong> {profile?.join_date ? profile.join_date.split(' ')[0] : ''}
        </p><br />

        <div className="container">
          <strong>자격증 파일:</strong>
          <div className="row">
            {imgList.map((item) => (
              <div key={item.sa_att_uid} className="col-sm">
                <img src={`${imageBasePath}${item.sa_file_path}`} className="img-fluid" alt="자격증 파일" style={{height : '80px', objectFit : 'cover', padding: '5px'}}/>
              </div>
            ))}
          </div>
        </div>


        {/* <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            {imgList.map((_, i) => (
              <button
                key={i}
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to={i}
                className={i === 0 ? "active" : ""}
                aria-current={i === 0 ? "true" : undefined}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          <div className="carousel-inner">
            {imgList.map((item, i) => (
              <div key={item.sa_att_uid} className={`carousel-item${i === 0 ? " active" : ""}`}>
                <img src={`${imageBasePath}${item.sa_file_path}`} className="d-block w-100" alt={`Slide ${i + 1}`} />
              </div>
            ))}
          </div>

          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>

          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div> */}






        <Link to="/profile/writer" state={{ profile }}>
          <button className={styles.button}>
            수정하기
          </button>
        </Link>
      </div>
    </form>
  );
}
