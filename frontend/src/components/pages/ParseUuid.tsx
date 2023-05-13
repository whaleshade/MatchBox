import React, { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

function isUuid(str: string) {
  const uuidPattern =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89aAbB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  return uuidPattern.test(str);
}

export default function ParseUuid({ children }: Props) {
  const navigate = useNavigate();
  const { id } = useParams<string>();
  const [is, set] = useState<boolean>(true);

  useEffect(() => {
    if (id !== undefined && !isUuid(id)) {
      navigate(`/notfound`);
    }
    set(false);
  }, [is]);

  return <div>{!is && children}</div>;
}
