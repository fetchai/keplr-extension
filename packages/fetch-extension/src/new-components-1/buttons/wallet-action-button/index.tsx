import React, { FC } from 'react';
import style from './style.module.scss'; 

interface Props {
  title: string;
  image: string;
  onClick: () => void;
}

export const WalletActionsButton: FC<Props> = ({ title, image, onClick }) => {
  return (
    <button  className={style["action"]} onClick={onClick}>
      <img
        src={require(`@assets/svg/wireframe/${image}`)}
        alt=""
      />
      <div className={style['img-title']}>{title}</div>
    </button>
  );
};

