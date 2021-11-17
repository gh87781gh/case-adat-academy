import { FC, memo, useCallback, useState } from 'react'
import { IconMenu, IconArrowUp, IconMore, IconPlus } from 'utility/icon'
import { useDrop } from 'react-dnd'
import { Card } from './Card'
import update from 'immutability-helper'
const ItemTypes = {
  CARD: 'card'
}

export interface ContainerState {
  cards: any[]
}

const Container: FC = memo(function Container() {
  const [cards, setCards] = useState([
    {
      id: 1,
      text: 'A'
    },
    {
      id: 2,
      text: 'B'
    },
    {
      id: 3,
      text: 'C'
    }
  ])

  const findCard = useCallback(
    (id: string) => {
      const card = cards.filter((c) => `${c.id}` === id)[0]
      return {
        card,
        index: cards.indexOf(card)
      }
    },
    [cards]
  )

  const moveCard = useCallback(
    (id: string, atIndex: number) => {
      const { card, index } = findCard(id)
      setCards(
        update(cards, {
          $splice: [
            [index, 1],
            [atIndex, 0, card]
          ]
        })
      )
    },
    [findCard, cards, setCards]
  )

  const [, drop] = useDrop(() => ({ accept: ItemTypes.CARD }))
  return (
    <div ref={drop} className='ad-course-menu'>
      {cards.map((card) => (
        <Card
          key={card.id}
          id={`${card.id}`}
          text={card.text}
          moveCard={moveCard}
          findCard={findCard}
        />
      ))}
    </div>
    // <div ref={drop} style={style}>
    //   {cards.map((card) => (
    //     <Card
    //       key={card.id}
    //       id={`${card.id}`}
    //       text={card.text}
    //       moveCard={moveCard}
    //       findCard={findCard}
    //     />
    //   ))}
    // </div>
  )
})
export default Container
