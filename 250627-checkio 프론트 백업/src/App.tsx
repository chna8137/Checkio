import { BrowserRouter, BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './router/AppRoutes';
import Layout from './comp/Layout';


function App() {
  return (
      <Router>
        <Layout>
          <AppRoutes />
        </Layout>
      </Router>

  );
}

export default App;
