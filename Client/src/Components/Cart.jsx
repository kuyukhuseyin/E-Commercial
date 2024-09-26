import React, { Component } from 'react';
import { List, Avatar, Button, notification } from "antd";

export default class Cart extends Component {

  // Calculates total price
  calculateTotalPrice = () => {
    let { items } = this.props;
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Posts cart to db
  handleSave = () => {
    let items = this.props.items;
    if (items.length > 0) {
      fetch("/user-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items),
      })
      .then(res => res.json())
      .then(() => {
        notification.success({ message: 'Cart saved successfully!' });
      })
      .catch(() => {
        notification.error({ message: 'Failed to save. Please try again.' });
      });
    }else {
      notification.error({ message: 'Cart is empty!' })
    }
  };

  // Handles item quantity changes
  handleQuantityChange = (item, change) => {
    let newQuantity = item.quantity + change;
    if (newQuantity > 0) {
      this.props.onUpdateQuantity(item, newQuantity);
    }
  };

  render() {
    let { items, onRemoveItem } = this.props;
    let totalPrice = this.calculateTotalPrice();

    return (
      <div>
        <List
          itemLayout="horizontal"
          dataSource={items}
          renderItem={item => (
            <List.Item
              actions={[
                <Button
                  type="default"
                  onClick={() => this.handleQuantityChange(item, -1)}
                >
                  -
                </Button>,
                <span>{item.quantity}</span>,
                <Button
                  type="default"
                  onClick={() => this.handleQuantityChange(item, 1)}
                >
                  +
                </Button>,
                <Button
                  danger
                  onClick={() => onRemoveItem(item)}
                >
                  Discard
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={item.images[0]} />}
                title={item.title}
                description={`$${item.price} x ${item.quantity}`}
              />
            </List.Item>
          )}
        />
        <div className="apply-cart" style={{ 
          position: 'absolute', 
          bottom: '0', 
          left: 0,  
          right: 0,
          width: '100%',
          padding: '20px 30px', 
          backgroundColor: '#fff', 
          boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)', 
          textAlign: 'right'
        }}>
          <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
          <Button 
            type="primary" 
            style={{ marginTop: '10px' }}
            onClick={this.handleSave}
          >
            Save Cart
          </Button>
        </div>
      </div>
    );
  }
}
