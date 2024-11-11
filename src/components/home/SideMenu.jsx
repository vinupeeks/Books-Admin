import React from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';

function Example({ show, onClose }) {
  return (
    <Offcanvas show={show} onHide={onClose} placement="start">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Side Menu</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <p>Some placeholder text. Add menu items, text, or images here.</p>
        <Button onClick={onClose} variant="secondary">Close Menu</Button>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default Example;