import { AntDesignOutlined, UserOutlined, GlobalOutlined } from "@ant-design/icons";
import { Avatar, Divider, Tooltip } from "antd";

export default function KolsGroup(kols) {
  let acatar = [];
  const getRadomBkColor = () => {
    const r = Math.floor(Math.random() * 256).toString(16);
    const g = Math.floor(Math.random() * 256).toString(16);
    const b = Math.floor(Math.random() * 256).toString(16);
    return `rgb(${r}, ${g}, ${b})`;
  };
  for (let i = 0; i < Object.keys(kols).length; i++) {
    acatar.push(<Avatar style={{ backgroundColor: getRadomBkColor() }} icon={<UserOutlined />}></Avatar>);
  }
  return (
    <div>
      <Avatar.Group
        maxCount={3}
        maxStyle={{
          color: "#f56a00",
          backgroundColor: "#fde3cf",
        }}
      >
        {acatar}
      </Avatar.Group>
    </div>
  );
}
