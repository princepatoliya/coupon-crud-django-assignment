import { Routes, Route, Navigate } from 'react-router-dom';
import CouponList from "../Component/CouponList";

const MainRoutes = (props) => {
  return (
    <Routes>
      <Route path='/' element={ <CouponList />}/>
    </Routes>
  )
}

export default MainRoutes;

