import { render, screen, fireEvent} from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import App from './App';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

 test('test that App component doesn\'t render duplicate Task', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', {name: /Add/i});
  const dueDateOne = "12/30/2023";
  const dueDateTwo = "11/24/2002";
  fireEvent.change(inputTask, { target: { value: "History Test"}});
  fireEvent.change(inputDate, { target: { value: dueDateOne}});
  fireEvent.click(element);
  fireEvent.change(inputTask, { target: { value: "History Test"}});
  fireEvent.change(inputDate, { target: { value: dueDateTwo}});
  fireEvent.click(element);
  const checkOne = screen.getByText(new RegExp(dueDateOne, "i"));
  expect(checkOne).toBeInTheDocument();
  expect(() => screen.getByText(new RegExp(dueDateTwo, "i"))).toThrow('Unable to find an element');
 });

 test('test that App component doesn\'t add a task without task name', () => {
  render(<App />);
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', {name: /Add/i});
  const dueDate = "12/30/2023";
  fireEvent.change(inputDate, { target: { value: dueDate}});
  fireEvent.click(element);
  expect(() => screen.getByText(new RegExp(dueDate, "i"))).toThrow('Unable to find an element');

 });

 test('test that App component doesn\'t add a task without due date', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const element = screen.getByRole('button', {name: /Add/i});
  fireEvent.change(inputTask, { target: { value: "History Test"}});
  fireEvent.click(element);
  expect(() => screen.getByText(/History Test/i)).toThrow('Unable to find an element');
 });



 test('test that App component can be deleted thru checkbox', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', {name: /Add/i});
  const dueDate = "12/30/2023";

  fireEvent.change(inputTask, { target: { value: "History Test"}});
  fireEvent.change(inputDate, { target: { value: dueDate}});
  fireEvent.click(element);

  const checkOne = screen.getByText(new RegExp(dueDate, "i"));
  expect(checkOne).toBeInTheDocument();

  const checkbox = screen.getByTestId('checkbox-item');
  fireEvent.click(checkbox);
  expect(() => screen.getByText(/History Test/i)).toThrow('Unable to find an element');
 });


 test('test that App component renders different colors for past due events', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', {name: /Add/i});
  const dueDateOne = "12/30/2023";
  const dueDateTwo = "11/24/2002";
  fireEvent.change(inputTask, { target: { value: "History Test"}});
  fireEvent.change(inputDate, { target: { value: dueDateOne}});
  fireEvent.click(element);
  fireEvent.change(inputTask, { target: { value: "English Test"}});
  fireEvent.change(inputDate, { target: { value: dueDateTwo}});
  fireEvent.click(element);
  const checkOne = screen.getAllByTestId('new-date-item');
  expect(checkOne[0].style.background).toBe("white");
  expect(checkOne[1].style.background).toBe("rgb(255, 128, 128)");
 });
