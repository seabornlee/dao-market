import { Table } from "antd";
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
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>
            <a href={site}>{site}</a>
          </div>
          <div style={{ position: "relative", height: 130 }}>
            <div style={{ position: "absolute", bottom: 0, right: 0 }}>
              <button className="button-customize" onClick={() => {
                // tx(writeContracts.Market.donate({ value: ethers.utils.parseEther("0.5") }));
              }}>Mint NFT 门票</button>
            </div>
          </div>
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
        kol: ["John", "Google，Facebook前员工。嘻嘻嘻休息休息数字游民，AIGC爱好者。著有AI与奇点等文章点对点"],
        wallet: "0xA75c6a6Af1757F543546BE1D472D0ACb1981d0Df",
      },
      {
        starttime: "上午10:10",
        topic: "《Maverick Protocol: Bring Real Yield to DeFi》",
        topic: [
          "《Maverick Protocol: Bring Real Yield to DeFi》",
          "Maverick Protocol offers a new infrastructure for decentralized finance, built to facilitate the most liquid markets for traders, liquidity providers, DAO treasuries, and developers, powered by a revolutionary Automated Market Maker (AMM).",
        ],
        kol: ["John", "Google，Facebook前员工。嘻嘻嘻休息休息数字游民，AIGC爱好者。著有AI与奇点等文章点对点"],
        wallet: "0xA75c6a6Af1757F543546BE1D472D0ACb1981d0Df",
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
        kol: ["John", "Google，Facebook前员工。嘻嘻嘻休息休息数字游民，AIGC爱好者。著有AI与奇点等文章点对点"],
        wallet: "0xA75c6a6Af1757F543546BE1D472D0ACb1981d0Df",
      },
      {
        starttime: "上午10:10",
        topic: [
          "《Maverick Protocol: Bring Real Yield to DeFi》",
          "Maverick Protocol offers a new infrastructure for decentralized finance, built to facilitate the most liquid markets for traders, liquidity providers, DAO treasuries, and developers, powered by a revolutionary Automated Market Maker (AMM).",
        ],
        kol: ["John", "Google，Facebook前员工。嘻嘻嘻休息休息数字游民，AIGC爱好者。著有AI与奇点等文章点对点"],
        wallet: "0xA75c6a6Af1757F543546BE1D472D0ACb1981d0Df",
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
          <div style={{ width: 270 }}>
            <span>{starttime}</span>
          </div>
        );
      },
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
            <div className="kol-experience">{kol[1]}</div>
          </div>
        );
      },
    },
    { title: "投票地址", dataIndex: "wallet", key: "wallet",
  render: wallet => {
    return (
      <div>{wallet}</div>
    )
  } },
  ];
  const expandedRowRender = data => {
    return (
      <div>
        <Table
          columns={detailscolumns}
          dataSource={data.details}
          size="middle"
          pagination={false}
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
    </div>
  );
}
