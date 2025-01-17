import React, { useState, useEffect } from "react";

import PageTitle from "example/components/Typography/PageTitle";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Badge,
  Avatar,
  Button,
  Pagination,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
  Select,
} from "@roketid/windmill-react-ui";
import { EditIcon, SunIcon, TrashIcon } from "icons";

import Layout from "example/containers/Layout";
import { useTaskStore } from "hooks/task/task-store"; // Import task-store hook
import { TaskCreateDTO, TaskUpdateDTO } from "hooks/task/task-schema";
import CTA from "example/components/CTA";

function TaskTable() {
  // Pagination state
  const [page, setPage] = useState(1);

  // Task store integration
  const { tasks, fetchTasks, updateTask, createTask, deleteTask } = useTaskStore();

  // Pagination setup
  const resultsPerPage = 10;
  const totalResults = tasks.length;

  // Paginated data
  const [paginatedTasks, setPaginatedTasks] = useState([]);

  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [editingTask, setEditingTask] = useState<TaskUpdateDTO | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null)


  const [newTask, setNewTask] = useState<TaskCreateDTO>({
    title: "new task",
    description: "desc",
    deadline: new Date().toISOString().slice(0, -1),
    priority: "MEDIUM",
    assignedToId: 1,
    status: "PENDING",
    createdById: 1,
  });

  // Handle page change
  const onPageChange = (p: number) => {
    setPage(p);
  };

  // Fetch tasks from the store on component mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Update paginated data whenever tasks or page changes
  useEffect(() => {
    const startIndex = (page - 1) * resultsPerPage;
    const endIndex = page * resultsPerPage;
    setPaginatedTasks(tasks.slice(startIndex, endIndex));
  }, [tasks, page]);

  // Handle opening the modal for editing
  const openEditModal = (task: any) => {
    setEditingTask({
      id: task.id,
      title: task.title,
      description: task.description,
      deadline: task.deadline,
      priority: task.priority,
      assignedToId: task.assignedTo.id,
      status: task.status,
      updatedById: 1, // Example value, replace with logged-in user ID
    });
    setIsEditModalOpen(true);
  };

  // Handle closing the modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTask(null);
  };

  const openCreateModal = () => {
    setNewTask({
      title: "Add new title",
      description: "Add new description",
      deadline: new Date().toISOString().slice(0, -1),
      priority: "MEDIUM",
      assignedToId: 1,
      status: "PENDING",
      createdById: 1,
    });
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };


  // Handle task update
  const handleUpdateTask = async () => {

    console.log("editingTask", editingTask);
    if (!editingTask) return;

    try {
      await updateTask(editingTask.id, editingTask);
      closeEditModal();
      fetchTasks(); // Refresh the task list
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  // Handle task creation
  const handleCreateTask = async () => {
    console.log("payload.task", newTask);
    try {
      await createTask(newTask);
      closeCreateModal();
      fetchTasks(); // Refresh the task list
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const handleDeleteTask = async () => {

    console.log("task.to.delete", taskToDelete)
    if (!taskToDelete) return;

    try {
      await deleteTask(taskToDelete.id);
      closeDeleteModal();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const openDeleteModal = (task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setTaskToDelete(null);
    setIsDeleteModalOpen(false);
  };

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <PageTitle>Task List</PageTitle>
        <Button onClick={openCreateModal} className="mb-4">
          <span>+ Create Task</span>
        </Button>
      </div>

      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Updated By</TableCell>
              <TableCell>Action</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {paginatedTasks.sort((a: any, b: any) => a.id - b.id).map((task: any) => (
              <TableRow key={task.id}>
                <TableCell>
                  <span className="text-sm">{task.id}</span>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-semibold">{task.title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{task.description}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">DL: {new Date(task.deadline).toLocaleString()}</p>
                    <div className='flex space-x-2 mt-2'>
                      <Badge className='text-xs'>{task.status}</Badge>
                      <Badge className='text-xs'>{task.priority}</Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{new Date(task.deadline).toLocaleString()}</span>
                </TableCell>
                <TableCell>
                  <Badge>{task.priority}</Badge>
                </TableCell>
                <TableCell>
                  <Badge>{task.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <Avatar
                      className="hidden mr-3 md:block"
                      src={task.assignedTo?.avatar || "https://randomuser.me/api/portraits/men/39.jpg"}
                      alt="User avatar"
                    />
                    <div>
                      <p className="font-semibold">{task.assignedTo?.username}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{task.assignedTo?.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-semibold">{task.createdBy?.username}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{task.createdBy?.email}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{new Date(task.createdAt).toLocaleString()}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-semibold">{task.updatedBy?.username}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{task.updatedBy?.email}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{new Date(task.updatedAt).toLocaleString()}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <Button
                      layout="link"
                      size="small"
                      aria-label="Edit"
                      onClick={() => openEditModal(task)}
                    >
                      <EditIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <Button
                      layout="link"
                      size="small"
                      aria-label="Delete"
                      onClick={() => openDeleteModal(task)}
                    >
                      <TrashIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            onChange={onPageChange}
            label="Table navigation"
          />
        </TableFooter>
      </TableContainer>

      {/* Edit Modal */}
      {editingTask && (
        <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
          <ModalHeader>Edit Task - {editingTask.title} - {editingTask.id}</ModalHeader>
          <ModalBody>
            <Label>
              <span>Title</span>
              <Input
                className="mt-1"
                value={editingTask.title}
                onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
              />
            </Label>
            <Label className="mt-4">
              <span>Description</span>
              <Input
                className="mt-1"
                value={editingTask.description}
                onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
              />
            </Label>
            <Label className="mt-4">
              <span>AssignTo</span>
              <Input
                className="mt-1"
                value={editingTask.assignedToId}
                onChange={(e) => setEditingTask({ ...editingTask, assignedToId: parseInt(e.target.value) })}
              />
            </Label>
            <Label className="mt-4">
              <span>Deadline</span>
              <Input
                type="datetime-local"
                className="mt-1"
                value={new Date(editingTask.deadline).toISOString().slice(0, -1)}
                onChange={(e) => setEditingTask({ ...editingTask, deadline: e.target.value })}
              />
            </Label>
            <Label className="mt-4">
              <span>Priority</span>
              <Select
                className="mt-1"
                value={editingTask.priority}
                onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </Select>
            </Label>
            <Label className="mt-4">
              <span>Status</span>
              <Select
                className="mt-1"
                value={editingTask.status}
                onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="TERMINATE">Terminate</option>
              </Select>
            </Label>
          </ModalBody>
          <ModalFooter>
            <Button layout="outline" onClick={closeEditModal}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTask}>Save</Button>
          </ModalFooter>
        </Modal>
      )}




      <Modal isOpen={isCreateModalOpen} onClose={closeCreateModal}>
        <ModalHeader>Create Task</ModalHeader>
        <ModalBody>
          <Label>
            <span>Title</span>
            <Input
              className="mt-1"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
          </Label>
          <Label className="mt-4">
            <span>Description</span>
            <Input
              className="mt-1"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
          </Label>
          <Label className="mt-4">
            <span>Assign To</span>
            <Input
              className="mt-1"
              value={newTask.assignedToId}
              onChange={(e) => setNewTask({ ...newTask, assignedToId: parseInt(e.target.value) })}
            />
          </Label>
          <Label className="mt-4">
            <span>Deadline</span>
            <Input
              type="datetime-local"
              className="mt-1"
              value={newTask.deadline}
              onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
            />
          </Label>
          <Label className="mt-4">
            <span>Priority</span>
            <Select
              className="mt-1"
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </Select>
          </Label>
          <Label className="mt-4">
            <span>Status</span>
            <Select
              className="mt-1"
              value={newTask.status}
              onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
            >
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="TERMINATE">Terminate</option>
            </Select>
          </Label>
        </ModalBody>
        <ModalFooter>
          <Button layout="outline" onClick={closeCreateModal}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateTask}
          >
            Save
          </Button>
        </ModalFooter>
      </Modal>


      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
        <ModalHeader>Delete Task - {taskToDelete?.id}</ModalHeader>
        <ModalBody>
          Are you sure you want to delete the task: <b>{taskToDelete?.title}</b>?
        </ModalBody>
        <ModalFooter>
          <Button layout="outline" onClick={closeDeleteModal}>
            Cancel
          </Button>
          <Button onClick={handleDeleteTask}>Delete</Button>
        </ModalFooter>
      </Modal>

    </Layout>
  );
}

export default TaskTable;
