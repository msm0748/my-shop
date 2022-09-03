import Gnb from "../Gnb";
import Auth from "../Auth";
export default function Container({ children }) {
  return (
    <>
      <Auth />
      <Gnb />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-20">{children}</div>
    </>
  );
}
