import { List, Button, Avatar } from 'antd';

const data = [
  {
    title: '主持周日治理例会',
  },
  {
    title: '指导用户开通钱包接收代币'
  },
  {
    title: '编写手册1.0',
  },
];

export default function Ramp(props) {
  return (
    <div>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              title={<a href="https://ant.design">{item.title}</a>}
            />
          </List.Item>
        )}
      />
      <Button type="primary">创建任务</Button>
    </div>
  );
}
