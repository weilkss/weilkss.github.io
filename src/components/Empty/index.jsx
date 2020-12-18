import React from 'react'

export const Empty = (props) => <div style={{ margin: 30, textAlign: 'center', ...props.style }} className={props.className}>
    <i className='xwb xwb-icon iconempty' style={{ color: '#999', fontSize: 56 }}></i>
    <p style={{ color: '#999', fontSize: 14, marginTop: 20 }}>{props.content ? props.content : '这里是空的哒~'}</p>
</div>

