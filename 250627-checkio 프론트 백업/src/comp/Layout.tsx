import { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Layout.module.css";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBoardHover, setIsBoardHover] = useState(false);
  const toggleSidebar = () => setIsOpen(prev => !prev);

  const sidebarClass = isOpen ? styles.sidebarOpen : styles.sidebarClosed;
  const mainClass = isOpen ? styles.mainShifted : styles.main;

  return (
    <div className={styles.wrapper}>

      <header className={styles.header}>
        <div className={styles.left}>
          <button
            className={styles.menuButton}
            onClick={toggleSidebar}
            aria-label="메뉴 열기/닫기"
            title="메뉴"
          >
            <img src="/icon/menu2.png" alt="메뉴" className={styles.menuIcon} />
          </button>
          <Link to="/">
            <img
              src="/icon/checkio.png"
              alt="Checkio"
              className={styles.logoImage}
            />
          </Link>
        </div>
        <div className={styles.auth}>
          <Link to="/login" className={styles.authLink}>로그인</Link>
          <Link to="/signup" className={styles.authLink}>회원가입</Link>
        </div>
      </header>

      {/* sidebar */}
      <aside className={sidebarClass}>
        <nav className={styles.nav}>
          <Link to="/profile" title="프로필" className={styles.iconLink}>
            <img src="/icon/user.png" alt="프로필" className={styles.icon} />
          </Link>

          <div
            className={styles.iconWithMenu}
            onMouseEnter={() => setIsBoardHover(true)}
            onMouseLeave={() => setIsBoardHover(false)}
          >
            <Link to="/board" title="게시판" className={styles.iconLink}>
              <img src="/icon/board.png" alt="게시판" className={styles.icon} />
            </Link>

            {isBoardHover && (
              <div className={styles.floatingMenu}>
                <Link to="/board/notice">공지사항</Link>
                <Link to="/board/free">자유게시판</Link>
              </div>
            )}
          </div>

          <Link to="/addressbook" title="주소록" className={styles.iconLink}>
            <img src="/icon/addressbook.png" alt="주소록" className={styles.icon} />
          </Link>
          <Link to="/organization" title="조직도" className={styles.iconLink}>
            <img src="/icon/users.png" alt="조직도" className={styles.icon} />
          </Link>
          <Link to="/management" title="전자결재" className={styles.iconLink}>
            <img src="/icon/board_e.png" alt="전자결재" className={styles.icon} />
          </Link>
          <Link to="/attendanceManage" title="일정" className={styles.iconLink}>
            <img src="/icon/calendar.png" alt="일정" className={styles.icon} />
          </Link>
          <Link to="/commuteList" title="개인근퇴관리" className={styles.iconLink}>
            <img src="/icon/calendar_clock.png" alt="개인근퇴관리" className={styles.icon} />
          </Link>
          <Link to="/center" title="고객센터" className={styles.iconLink}>
            <img src="/icon/headset.png" alt="고객센터" className={styles.icon} />
          </Link>
        </nav>
      </aside>

      <main className={mainClass}>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
};

export default Layout