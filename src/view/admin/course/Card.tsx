import { CSSProperties, FC, memo } from 'react'
import { IconMenu, IconArrowUp, IconMore, IconPlus } from 'utility/icon'
import { useDrag, useDrop } from 'react-dnd'

const style: CSSProperties = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move'
}
const style2: CSSProperties = {
  border: '1px dashed red',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'red',
  cursor: 'move'
}

export interface CardProps {
  id: string
  text: string
  moveCard: (id: string, to: number) => void
  findCard: (id: string) => { index: number }
}

interface Item {
  id: string
  originalIndex: number
}

const ItemTypes = {
  CARD: 'card'
}

export const Card: FC<CardProps> = memo(function Card({
  id,
  text,
  moveCard,
  findCard
}) {
  const originalIndex = findCard(id).index
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: ItemTypes.CARD,
      item: { id, originalIndex },
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      }),
      end: (item, monitor) => {
        const { id: droppedId, originalIndex } = item
        const didDrop = monitor.didDrop()
        if (!didDrop) {
          moveCard(droppedId, originalIndex)
        }
      }
    }),
    [id, originalIndex, moveCard]
  )

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.CARD,
      canDrop: () => false,
      hover({ id: draggedId }: Item) {
        if (draggedId !== id) {
          const { index: overIndex } = findCard(id)
          moveCard(draggedId, overIndex)
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
      })
    }),
    [findCard, moveCard]
  )

  return (
    <div ref={preview} className={isDragging ? 'isDragging shadow' : 'shadow'}>
      <div className='item level-1'>
        <div ref={(node) => drag(drop(node))} className='item-btn grab'>
          <IconMenu />
        </div>
        <IconArrowUp className='item-btn-arrow' />
        <div className='item-text'>{text}</div>
        <div className='item-extra'>
          <IconPlus className='item-btn plus' />
          <IconMore className='item-btn more' />
        </div>
      </div>
    </div>

    // <div ref={preview} style={{ ...style2 }}>
    //   <div ref={(node) => drag(drop(node))} style={{ ...style, opacity }}>
    //     {text}
    //   </div>
    // </div>
  )
})
