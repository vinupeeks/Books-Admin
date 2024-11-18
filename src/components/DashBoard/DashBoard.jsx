import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Row, Col, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import RouteConstants from '../../constant/Routeconstant';
import LastBooks from '../Books/LastBooks';

function Dashboard() {
    const navigate = useNavigate();

    const handleCardClick = (cardName) => {
        alert(`${cardName} card clicked!`);
    };

    const cardsData = [
        { id: 1, md: 3, xs: 12, title: 'New Individual Membership', borderRadius: '12px', borderColor: '#8ab9e6', description: 'Details of new individual memberships.', height: '200px' },
        { id: 2, md: 4, xs: 12, title: 'New Family Membership', borderRadius: '12px', borderColor: '#8ab9e6', description: 'Details of new family memberships.', height: '200px' },
        { id: 3, md: 4, xs: 12, title: 'Book Listing', borderRadius: '12px', borderColor: '#8ab9e6', description: 'Name/Title/Issue/Return', navigateTo: RouteConstants.ROOT, height: '200px' },
        { id: 4, md: 4, xs: 12, title: 'Total Members', borderRadius: '10px', borderColor: '#8ab9e6', description: 'Individual, Family members count.', height: '200px' },
        { id: 5, md: 3, xs: 12, title: 'Total Dues', borderRadius: '15px', borderColor: '#8ab9e6', description: 'Total amount due for members.', height: '200px' },
        { id: 6, md: 4, xs: 12, title: 'Search Members', borderRadius: '8px', borderColor: '#8ab9e6', description: 'Search members by name, flat, or dues.', height: '200px' },
        { id: 7, md: 3, xs: 5, title: 'Member Listing', borderRadius: '10px', borderColor: '#8ab9e6', description: 'Name/Flat/Dues', height: '200px' }
    ];

    return (
        <Container fluid style={{ height: '100vh', margin: '15px' }} className="p-0">
            <Row className="g-4" style={{ height: '100%' }}>
                <Col md={4} xs={10}>
                    <Card style={{ height: '100%', border: '2px solid gray', borderRadius: '8px', backgroundColor: '#EDF1F3' }} className="shadow-lg">
                        <Card.Body>
                            <div>
                                <LastBooks />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={8} xs={12}>
                    <Row className="g-4">
                        {cardsData.map(card => (
                            <Col md={card.md} xs={card.xs} key={card.id} className="d-flex justify-content-center">
                                <Card className="shadow-sm"
                                    style={{
                                        borderRadius: card.borderRadius,
                                        backgroundColor: '#EDF1F3',
                                        height: card.height,
                                        boxShadow: '0 6px 10px rgba(0, 0, 0, 0.1)', 
                                    }}
                                    onClick={card.navigateTo ? () => navigate(card.navigateTo) : () => handleCardClick(card.title)}>
                                    <Card.Body>
                                        <h6 className="text-dark fw-bold">{card.title}</h6>
                                        <p>{card.description}</p> 
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}
  
export default Dashboard;
