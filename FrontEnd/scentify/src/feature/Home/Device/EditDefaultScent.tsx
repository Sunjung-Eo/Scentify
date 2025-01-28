import SpaceDescription from "./SpaceDescription";
import EditSpaceTab from "./EditSpaceTab";

function EditDefaultScent() {
  return (
    <div>
      <EditSpaceTab></EditSpaceTab>
      <div className="mt-4">
        <SpaceDescription></SpaceDescription>
      </div>
    </div>
  );
}
export default EditDefaultScent;
//완료 눌렀을때 제출핸들러 작동하게 해야함
