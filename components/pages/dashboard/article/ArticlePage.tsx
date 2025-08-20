'use client';
import { useHeaderTitle } from '@/providers/HeaderTitleProvider';
import { NextPage } from 'next';
import CreateModal from './CreateModal';
import { useModal } from '@/hooks/useModal';
import { toast } from 'sonner';
import { TArticle } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable, SortableHeader } from '@/components/default/DataTable';
import useArticle from '@/hooks/datasource/useArticle';
import { useState } from 'react';
import { httpClient } from '@/lib/httpClient';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, Plus } from 'lucide-react';
import DeleteButton from '@/components/default/action/DeleteButton';
import LoadingIndicator from '@/components/default/LoadingIndicator';
import Link from 'next/link';
import Alert from '@/components/default/action/Alert';

const ArticlePage: NextPage = () => {
  useHeaderTitle('Article');
  const {
    openCreate,
    openDelete,
    openEdit,
    setOpenCreate,
    setOpenDelete,
    setOpenEdit,
  } = useModal();
  const {
    data,
    error,
    filter: { order, sort },
    isLoading,
    refetch,
    status,
  } = useArticle();
  const [selectedItem, setSelectedItem] = useState<TArticle | undefined>();
  const columns: ColumnDef<TArticle>[] = [
    {
      header: '#',
      cell: (info) => info.row.index + 1,
    },
    {
      accessorKey: 'title',
      header: () => (
        <SortableHeader
          label="Title"
          columnId="title"
          order={order}
          sort={sort}
        />
      ),
    },
    {
      accessorKey: 'slug',
      header: () => (
        <SortableHeader
          label="Slug"
          columnId="slug"
          order={order}
          sort={sort}
        />
      ),
    },
    {
      id: 'action',
      header: () => <p>Action</p>,
      cell: ({ row }) => {
        const item = row.original;
        const handleEdit = () => {
          setSelectedItem(item);
          setOpenEdit(true);
        };
        const onDelete = () => {
          setSelectedItem(item);
          setOpenDelete(true);
        };
        return (
          <div className="flex">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default">
                  <span>Actions</span>
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>

                <DropdownMenuItem variant="destructive" onClick={onDelete}>
                  delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
  const handleDelete = async () => {
    if (!selectedItem) return;
    const data = await httpClient.delete(`/articles/${selectedItem.id}`);
    if (data.status != 200) {
      toast.error(data.message);
      return;
    }
    toast.success('article deleted successfully');
    refetch();
  };
  if (error || isLoading)
    return <LoadingIndicator size={15} className="h-screen w-full" />;

  return (
    <div className="bg-foundation-100 mt-4 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <p className="py-4 text-2xl font-bold">Articles</p>
        <Button asChild>
          <Link href={'/dashboard/article/create'}>
            <div className="flex items-center gap-2">
              <Plus />
              <p>Create Article</p>
            </div>
          </Link>
        </Button>
      </div>
      <div className="mt-4">
        <DataTable data={data} columns={columns} isLoading={isLoading} />
      </div>
      {openCreate && (
        <CreateModal
          isOpen={openCreate}
          setIsOpen={setOpenCreate}
          refresh={refetch}
        />
      )}
      {/* {openEdit && selectedItem && (
            <EditModal
                isOpen={openEdit}
                setIsOpen={setOpenEdit}
                item={selectedItem}
            />
        )} */}
      {openDelete && selectedItem && (
        <Alert
          handler={handleDelete}
          show={openDelete}
          setShow={setOpenDelete}
        />
      )}
    </div>
  );
};

export default ArticlePage;
