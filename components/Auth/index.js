import { useEffect } from "react";
import { auth } from "../../fBase";
import { onAuthStateChanged } from "firebase/auth";
import { getUserInfo, setUserLogOut } from "../../store/userSlice";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { db } from "../../fBase";

export default function Auth() {
  const dispatch = useDispatch();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        const q = query(collection(db, "user"), where("email", "==", user.email));
        getDocs(q).then((docs) => {
          docs.forEach((doc) => {
            const data = doc.data();
            dispatch(
              getUserInfo({
                email: data.email,
                name: data.name,
                phone: data.phone,
                address: data.address,
                detailAddress: data.detailAddress,
                docId: doc.id,
                uid,
              })
            );
          });
        });
      } else {
        dispatch(setUserLogOut());
      }
    });
  }, []);
  return <></>;
}
