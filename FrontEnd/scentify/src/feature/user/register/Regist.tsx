import RegistForm from "./components/RegistForm";
import Layout from "../../../layout/Layout";

const Regist = () => {
  return (
    <Layout>
      <div className="auth-container flex justify-center items-center">
        <RegistForm onRegist={() => console.log("회원가입 성공")} />
      </div>
    </Layout>
  );
};

export default Regist;
