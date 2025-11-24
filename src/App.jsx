import { Routes, Route } from 'react-router-dom';
import FaqList from "./pages/faq/FaqList";
import FaqView from "./pages/faq/FaqView";

function App() {
  return (
    <div>
      <h1>Spring Boot + React 연동</h1>
      <Routes>
        {/* 기본 주소(/)로 오면 FaqList 보여주기 */}
        <Route path="/" element={<FaqList />} />
        
        {/* /faq/view/글번호 로 오면 FaqView 보여주기 */}
        <Route path="/faq/view/:faqNo" element={<FaqView />} />
      </Routes>
    </div>
  );
}

export default App;