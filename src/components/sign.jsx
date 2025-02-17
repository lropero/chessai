import React from 'react'

const Sign = () => {
  const hover = {
    color: '#da3435'
  }

  const style = {
    backgroundColor: '#ff6347',
    borderRadius: '0 0 10px 0',
    boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)',
    color: '#f3f3f3',
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: '16px',
    fontWeight: 'bold',
    left: 0,
    margin: 0,
    padding: '12px 18px',
    position: 'fixed',
    textDecoration: 'none',
    top: 0,
    zIndex: 9999
  }

  return (
    <a href='https://www.vocal0.com' onMouseEnter={event => (event.target.style.color = hover.color)} onMouseLeave={event => (event.target.style.color = style.color)} style={style} target='_blank' rel='noreferrer'>
      DEMO Vocal0
    </a>
  )
}

export default Sign
