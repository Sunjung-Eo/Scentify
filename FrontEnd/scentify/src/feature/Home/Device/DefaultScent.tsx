import SpaceDescription from "./SpaceDescription";
import SpaceTab from "./SpaceTab";

function DefaultScent() {
  return (
    <div className="content px-4">
      <SpaceTab></SpaceTab>
      <div className="mt-4">
        <SpaceDescription></SpaceDescription>
      </div>
    </div>
  );
}
export default DefaultScent;
//완료 눌렀을때 제출핸들러 작동하게 해야함
