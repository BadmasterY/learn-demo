import React, { useState } from 'react';
import { Skeleton, List } from 'antd';

import { State as ArticaleState } from '../../interfaces/articale';

import './home.css';

function Home() {
    const [loading, setLoading] = useState(false);
    const articales: ArticaleState[] = [];

    function loadingStart() {
        setLoading(true);

        setTimeout(() => { setLoading(false) }, 2000);
    }

    return (
        <div className="home">
            <Skeleton loading={loading} active>
                <List 
                    itemLayout="vertical"
                    size="large"
                    pagination= {{
                        onChange: page => {
                            console.log(page);
                        },
                        pageSize: 10
                    }}
                    dataSource={articales}
                />
            </Skeleton>
        </div>
    );
}

export default Home;
