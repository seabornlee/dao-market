import { Table, Modal, Avatar, Image, Row, Col, Slider } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { GlobalOutlined, CalendarOutlined } from "@ant-design/icons";
import KolsGroup from "./KolsGroup";
import { ethers } from "ethers";
import {
  useBalance,
  useContractLoader,
  useContractReader,
  useGasPrice,
  useOnBlock,
  useUserProviderAndSigner,
} from "eth-hooks";

import { useContractConfig } from "../hooks";
import { Transactor } from "../helpers";
import { INFURA_ID, NETWORK, NETWORKS } from "../constants";
const targetNetwork = NETWORKS.localhost; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)
const localProviderUrl = targetNetwork.rpcUrl;
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
const localProvider = new ethers.providers.StaticJsonRpcProvider(localProviderUrlFromEnv);

export default function Meetings() {
  const poktMainnetProvider = navigator.onLine
    ? new ethers.providers.StaticJsonRpcProvider(
        "https://eth-mainnet.gateway.pokt.network/v1/lb/611156b4a585a20035148406",
      )
    : null;
  const mainnetProvider =
    poktMainnetProvider && poktMainnetProvider._isProvider
      ? poktMainnetProvider
      : scaffoldEthProvider && scaffoldEthProvider._network
      ? scaffoldEthProvider
      : mainnetInfura;

  const [injectedProvider, setInjectedProvider] = useState();
  const [address, setAddress] = useState();

  const gasPrice = useGasPrice(targetNetwork, "fast");
  const userProviderAndSigner = useUserProviderAndSigner(injectedProvider, localProvider);
  const userSigner = userProviderAndSigner.signer;

  useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        setAddress(newAddress);
      }
    }
    getAddress();
  }, [userSigner]);

  const localChainId = localProvider && localProvider._network && localProvider._network.chainId;
  const tx = Transactor(userSigner, gasPrice);
  console.log(tx)

  const contractConfig = useContractConfig();

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider, contractConfig);

  // If you want to make 🔐 write transactions to your contracts, use the userSigner:
  const writeContracts = useContractLoader(userSigner, contractConfig, localChainId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrivateChannelModalOpen, setIsPrivateChannelModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    tx(writeContracts.Market.donate(1, ethers.utils.parseEther("0.5")));
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showPrivateChannelModal = () => {
    setIsPrivateChannelModalOpen(true);
  };

  const handlePrivateChannelOk = () => {
    setIsPrivateChannelModalOpen(false);
  };

  const handlePrivateChannelCancel = () => {
    setIsPrivateChannelModalOpen(false);
  };

  const columns = [
    {
      title: "时间",
      dataIndex: "time",
      key: "time",
      render: arr => {
        return (
          <div>
            <CalendarOutlined />
            <span> {arr[0]} </span>
            <span>至 </span>
            <span>{arr[1]}</span>
          </div>
        );
      },
    },
    {
      title: "关键词",
      dataIndex: "keyword",
      key: "keyword",
      render: arr => {
        return (
          <div>
            <div className="keyword-title">{arr[0]}</div>
            <div className="keyword-overwrite">{arr[1]}</div>
          </div>
        );
      },
    },
    {
      title: "分享人",
      dataIndex: "kols",
      key: "kol",
      render: kols => {
        return <KolsGroup {...kols} />;
      },
    },
    {
      title: "分布式集会城市",
      dataIndex: "cities",
      key: "city",
      render: cites => {
        return (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div>
              <GlobalOutlined />
              <span> {cites.length > 3 ? cites[0] + "," + cites[1] + "," + cites[2] + "..." : cites.toString()}</span>
              <span>({cites.length})</span>
            </div>
            <div style={{ position: "relative", height: 130 }}>
              <div style={{ position: "absolute", bottom: 0, right: 0 }}>
                <button className="button-customize">进行线上集会演讲</button>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "线上直播",
      dataIndex: "site",
      key: "site",
      render: site => {
        const marks: SliderMarks = {
          1: '$1',
          5: '$5',
          10: '$10',
          15: '$15',
        };
        return (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div>
              <a href={site}>{site}</a>
            </div>
            <div style={{ position: "relative", height: 130 }}>
              <div style={{ position: "absolute", bottom: 0, right: 0 }}>
                <button className="button-customize" onClick={() => {
                  showModal();
                }}>Mint NFT 门票</button>
              </div>
            </div>
            <Modal title="Mint NFT，加入社区，激励创作者" visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
              <Row>
                <Col span={12}>
                  <Image
                    width={200}
                    height={300}
                    src="https://i.ibb.co/q1Ysq4H/1.png"
                  />
                  <b>ShangHai NFT</b>
                </Col>
                <Col span={12}>
                  <Image
                    width={200}
                    height={300}
                    src="https://i.ibb.co/fSr67s8/Screen-Shot-2022-12-21-at-11-47-29.png"
                  />
                  <b>Ticket NFT</b>
                </Col>
              </Row>
              <br/>
              <div>
                选择捐赠额后Mint，可获得两枚NFT徽章，进入IdeasBazaar的城市和演讲主题频道；<br/><br/>
                您的捐赠额会在集会结束，退票期（72小时）过后，50%的金额转移给演讲者，10%给协议官方，40%返还给Ticket-NFT持有人。<br/><br/>
                因此，如果您喜欢演讲，可将Ticket-NFT转赠给演讲者。或转给所在城市的活动组织者，鼓励更多本地自组织活动发生。<br/><br/>
                Mint门票，积极投票或组织本地集会活动的用户将在后续获得IdeasBazaar的Token空投奖励。<br/><br/>
              </div>
              <Slider marks={marks} min={1} max={15} defaultValue={10} />
            </Modal>
          </div>
        );
      },
    },
  ];
  const data = [
    {
      key: 1,
      time: ["2020年1月10日", "2020年1月20日"],
      keyword: ["人工智能奇点来临", "5场主题演讲。探讨人工智能，技术演化相关主题。"],
      kols: ["John", "John"],
      cities: ["NewYork", "DaLi", "Beijing"],
      site: "https://www.baidu.com",
      details: [
        {
          starttime: "2020年1月11日上午10:10",
          topic: [
            "《AIGC爆火带来的风险与机遇》",
            "AIGC全称为AI-Generated Content，即利用人工智能技术来生产内容，在创意、表现力、创作速度、迭代、 传播等方面都具有显著的技术优势，已经成为继PGC（专业生产内容）和UGC（用户生产内容）之后新型的内容创作方式。最近AIGC爆火，叠加Web3及元宇宙概念，在市场上刮起一阵大风，我们邀请到许多Web3的开发者们从各自项目的角度来谈一谈AIGC为大家的项目带来的风险和机遇。",
          ],
          kol: ["John", "Google，Facebook前员工。嘻嘻嘻休息休息数字游民，AIGC爱好者。著有AI与奇点等文章点对点", "0xA75c6a6Af1757F543546BE1D472D0ACb1981d0Df"]
        },
        {
          starttime: "上午10:10",
          topic: "《Maverick Protocol: Bring Real Yield to DeFi》",
          topic: [
            "《Maverick Protocol: Bring Real Yield to DeFi》",
            "Maverick Protocol offers a new infrastructure for decentralized finance, built to facilitate the most liquid markets for traders, liquidity providers, DAO treasuries, and developers, powered by a revolutionary Automated Market Maker (AMM).",
          ],
          kol: ["John", "Google，Facebook前员工。嘻嘻嘻休息休息数字游民，AIGC爱好者。著有AI与奇点等文章点对点", "0xA75c6a6Af1757F543546BE1D472D0ACb1981d0Df"]
        },
      ],
    },
    {
      key: 2,
      time: ["2022年3月2日", "2022年12月30日"],
      keyword: ["web3", "bbbb"],
      title: "hello",
      kols: ["a", "b"],
      cities: ["Dali", "Chengdu", "Shanghai", "BeiJing"],
      site: "https://www.baidu.com",
      details: [
        {
          starttime: "2020年1月11日上午10:10",
          topic: [
            "《Maverick Protocol: Bring Real Yield to DeFi》",
            "Maverick Protocol offers a new infrastructure for decentralized finance, built to facilitate the most liquid markets for traders, liquidity providers, DAO treasuries, and developers, powered by a revolutionary Automated Market Maker (AMM).",
          ],
          kol: ["John", "Google，Facebook前员工。嘻嘻嘻休息休息数字游民，AIGC爱好者。著有AI与奇点等文章点对点", "0xA75c6a6Af1757F543546BE1D472D0ACb1981d0Df"]
        },
        {
          starttime: "上午10:10",
          topic: [
            "《Maverick Protocol: Bring Real Yield to DeFi》",
            "Maverick Protocol offers a new infrastructure for decentralized finance, built to facilitate the most liquid markets for traders, liquidity providers, DAO treasuries, and developers, powered by a revolutionary Automated Market Maker (AMM).",
          ],
          kol: ["John", "Google，Facebook前员工。嘻嘻嘻休息休息数字游民，AIGC爱好者。著有AI与奇点等文章点对点", "0xA75c6a6Af1757F543546BE1D472D0ACb1981d0Df"]
        },
      ],
    },
  ];

  const detailscolumns = [
    {
      title: "开始时间",
      dataIndex: "starttime",
      key: "starttime",
      render: starttime => {
        return (
          <div style={{ width: 170 }}>
            <span>{starttime}</span>
          </div>
        );
      },
      fixed: "left"
    },
    {
      title: "主题",
      dataIndex: "topic",
      key: "topic",
      render: topic => {
        return (
          <div>
            <p className="details-topic-title">{topic[0]}</p>
            <p className="details-topic-overwrite">{topic[1]}</p>
          </div>
        );
      },
    },
    {
      title: "教练",
      dataIndex: "kol",
      key: "kol",
      render: kol => {
        return (
          <div style={{ display: "flex" }}>
            <div className="kol-name">
              <KolsGroup props={1} />
              <p>{kol[0]}</p>
            </div>
            <div>
              <div>{kol[2]}</div>
              <div className="kol-experience">{kol[1]}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: "私人频道",
      dataIndex: "privateChannel",
      key: "privateChannel",
      render: barCodeUrl => {
        return (
          <div className="private-channel" onClick={
            () => {
              setIsPrivateChannelModalOpen(true);
            }
            }>
            <Row align="middle">
              <Col span={12}>
                加入Speaker私人频道
              </Col>
              <Col span={12}>
                <Image
                  width={50}
                  height={50}
                  preview={false}
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQk-zUE6CGueaRa9uk2vUaPvGGsVlRHw7Z32MCu2AmRwAjR8mrP7fygKlyfcHEUsMBPvfM&usqp=CAU"
                />
              </Col>
            </Row>
          </div>
        )
      },
      width: 200
    }
  ];
  const expandedRowRender = data => {
    return (
      <div>
        <Table
          columns={detailscolumns}
          dataSource={data.details}
          size="small"
          pagination={false}
          showHeader={false}
          className="details-table"
        ></Table>
      </div>
    );
  };
  return (
    <div className="meetings">
      <Table
        columns={columns}
        expandable={{
          expandedRowRender,
        }}
        dataSource={data}
        pagination={true}
        size="middle"
      />
      <Modal title="加入Speaker私人频道" visible={isPrivateChannelModalOpen} onOk={handlePrivateChannelOk} onCancel={handlePrivateChannelCancel}>
        <div className="pc-wrapper">
          <div className="pc-tips">如果你喜欢Lily的演讲，可以将自己的Ticket-NFT发送给Ta下方的地址，将会获得一枚SpeakerFans-NFT，然后可以进入Ta在IdeasBazzar Discord中的私人频道进行发言交流。</div>
          <div>
            <Avatar size={82} src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
          </div>
          <div>
            <Image
              width={200}
              height={200}
              src="data:image/png;base64,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"
            />
          </div>
          <div>
            0xA75c6a6Af1757F543546BE1D472D0ACb1981d0Df
          </div>
          <div>
            Arbitrium
          </div>
        </div>
      </Modal>
    </div>
  );
}
