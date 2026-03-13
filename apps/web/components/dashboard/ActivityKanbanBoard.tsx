"use client";

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';

const initialData = {
  columns: {
    'active-users': {
      id: 'active-users',
      title: 'Active Users',
      items: [
        { id: '1', content: 'Alice signed in', time: '2m ago' },
        { id: '2', content: 'Bob updated profile', time: '1h ago' },
      ]
    },
    'assignments': {
      id: 'assignments',
      title: 'Assignments',
      items: [
        { id: '3', content: 'Math Quiz submitted', time: '15m ago' },
        { id: '4', content: 'Physics Lab pending', time: '3h ago' },
      ]
    },
    'attendance': {
      id: 'attendance',
      title: 'Attendance',
      items: [
        { id: '5', content: 'CS101 session started', time: '5m ago' },
        { id: '6', content: 'ENG202 session ended', time: '45m ago' },
      ]
    }
  },
  columnOrder: ['active-users', 'assignments', 'attendance']
};

export function ActivityKanbanBoard() {
  const [data, setData] = useState(initialData);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onDragEnd = (result: any) => {
    const { destination, source } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const start = data.columns[source.droppableId as keyof typeof data.columns];
    const finish = data.columns[destination.droppableId as keyof typeof data.columns];

    if (start === finish) {
      const newItemIds = Array.from(start.items);
      const [removed] = newItemIds.splice(source.index, 1);
      newItemIds.splice(destination.index, 0, removed);

      const newColumn = { ...start, items: newItemIds };
      setData({ ...data, columns: { ...data.columns, [newColumn.id]: newColumn } });
      return;
    }

    const startItems = Array.from(start.items);
    const [removed] = startItems.splice(source.index, 1);
    const newStart = { ...start, items: startItems };

    const finishItems = Array.from(finish.items);
    finishItems.splice(destination.index, 0, removed);
    const newFinish = { ...finish, items: finishItems };

    setData({
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish
      }
    });
  };

  if (!mounted) return null;

  return (
    <div className="p-6 bg-card rounded-xl border border-white/5 shadow-lg w-full overflow-hidden">
      <h3 className="text-lg font-semibold text-white mb-6">Activity Board</h3>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.columnOrder.map((columnId) => {
            const column = data.columns[columnId as keyof typeof data.columns];
            return (
              <div key={column.id} className="flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                  <h4 className="text-sm font-medium text-white/40 uppercase tracking-wider">{column.title}</h4>
                  <span className="text-xs bg-white/5 px-2 py-0.5 rounded-full text-white/50">{column.items.length}</span>
                </div>
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={cn(
                        "flex flex-col gap-3 p-2 rounded-lg transition-colors min-h-[200px]",
                        snapshot.isDraggingOver ? "bg-white/5" : "bg-transparent"
                      )}
                    >
                      {column.items.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={cn(
                                "p-4 rounded-lg border border-white/5 shadow-sm transition-all",
                                snapshot.isDragging ? "bg-primary shadow-xl scale-105" : "bg-black/20 hover:border-white/10"
                              )}
                            >
                              <p className="text-sm text-white font-medium">{item.content}</p>
                              <span className="text-[10px] text-white/40 mt-2 block">{item.time}</span>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
