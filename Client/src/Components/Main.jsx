import React, { Component } from 'react';
import { Layout, Input, Menu, Card, Spin, notification, Select, Row, Col, Empty, Button, Drawer, List, Avatar } from 'antd';
import { SearchOutlined, StarOutlined, UserOutlined, ShoppingCartOutlined, StarFilled } from '@ant-design/icons';
import { Link, Navigate } from 'react-router-dom';
import Cart from './Cart';
import './Main.css';

let { Header, Content } = Layout;
let { Meta } = Card;
let { Option } = Select;

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      loading: true,
      redirectToProfilePage: false,
      categories: [],
      filteredProducts: [],
      selectedCategory: 'All',
      searchTerm: '',
      cartItems: [],
      isCartVisible: false,
      isFavoritesVisible: false,
      starredProducts: {},
    };
  }

  componentDidMount() {
    fetch('https://api.escuelajs.co/api/v1/products')
      .then((res) => res.json())
      .then((products) => {
        let categories = [...new Set(products.map((product) => product.category.name))];
        this.setState({ products, loading: false, filteredProducts: products, categories });
      })
      .catch((err) => {
        notification.error({
          message: 'Fetching error!',
          description: err.message,
        });
        this.setState({ loading: false });
      });
  }

  // Handles category changing
  handleCategoryChange = (value) => {
    this.setState({ selectedCategory: value, searchTerm: '' }, () => {
      this.filterProducts();
    });
  };

  // Handles searchbar events
  handleSearchBar = (e) => {
    this.setState({ searchTerm: e.target.value }, () => {
      this.filterProducts();
    });
  };

  // Filters products according to categories or search terms
  filterProducts = () => {
    let { products, selectedCategory, searchTerm } = this.state;
    let filteredProducts = products;

    if (selectedCategory !== 'All') {
      filteredProducts = filteredProducts.filter(
        (product) => product.category.name === selectedCategory
      );
    }

    if (searchTerm) {
      filteredProducts = filteredProducts.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    this.setState({ filteredProducts });
  };

  // Handles adding products to cart
  addToCart = (product) => {
    this.setState((prevState) => {
      let existingItem = prevState.cartItems.find(item => item.id === product.id);
      if (existingItem) {
        return {
          cartItems: prevState.cartItems.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }
      return {
        cartItems: [...prevState.cartItems, { ...product, quantity: 1 }]
      };
    });

    notification.success({ message: `${product.title} added to cart!` });
  };

  // Toggles cart visibility
  toggleCartVisibility = () => {
    this.setState((prevState) => ({
      isCartVisible: !prevState.isCartVisible
    }));
  };

  // Toggles favorites visibility
  toggleFavoritesVisibility = () => {
    this.setState((prevState) => ({
      isFavoritesVisible: !prevState.isFavoritesVisible
    }));
  };

  // Handles favorite icon 
  handleStar = (productId) => {
    this.setState((prevState) => ({
      starredProducts: {
        ...prevState.starredProducts,
        [productId]: !prevState.starredProducts[productId],
      },
    }));
  };

  // Handles removing items from cart
  handleRemoveItem = (item) => {
    this.setState((prevState) => ({
      cartItems: prevState.cartItems.filter(cartItem => cartItem.id !== item.id)
    }));
  };

  // Handles quantity of products
  handleUpdateQuantity = (item, newQuantity) => {
    this.setState((prevState) => ({
      cartItems: prevState.cartItems.map(cartItem =>
        cartItem.id === item.id ? { ...cartItem, quantity: newQuantity } : cartItem
      )
    }));
  };

  // Handles redirect to profile page
  toggleRedirectToProfile = () => {
    this.setState({
      redirectToProfilePage: true
    })
  }

  render() {
    let { filteredProducts, loading, categories, cartItems, isCartVisible, isFavoritesVisible, starredProducts, redirectToProfilePage } = this.state;
    let favoriteProducts = filteredProducts.filter(product => starredProducts[product.id]);

    if (redirectToProfilePage) {
      return <Navigate to="/profile" />;
    }

    return (
      <Layout>
        <Header className="header">
          <div className="logo">
            <Link to="/main">
              <h1>InfiniteDeals</h1>
            </Link>
          </div>
          <div className="header-content">
            <div className="search-bar">
              <Input
                placeholder="Search"
                prefix={<SearchOutlined />}
                style={{ width: '200px' }}
                onChange={this.handleSearchBar}
              />
            </div>
            <div className="category-selector">
              <Select
                placeholder="Select category"
                style={{ width: '200px' }}
                onChange={this.handleCategoryChange}
                defaultValue={"All"}
              >
                <Option value="All">All</Option>
                {categories.map((category) => (
                  <Option key={category} value={category}>
                    {category}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            className="header-menu"
          >
            <Menu.Item 
              key="cart" 
              icon={<ShoppingCartOutlined />}
              onClick={this.toggleCartVisibility}
            />
            <Menu.Item 
              key="favorites" 
              icon={<StarOutlined />}
              onClick={this.toggleFavoritesVisibility}
            />
            <Menu.Item 
              key="profile" 
              icon={<UserOutlined />}
              onClick={this.toggleRedirectToProfile}
            />
          </Menu>
        </Header>
        <Content className="content">
          {loading ? (
            <div className="loading-container">
              <Spin size="large" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="no-data-container">
              <Empty description="No Data" />
            </div>
          ) : (
            <Row gutter={16} className="card-container">
              {filteredProducts.map((product) => (
                <Col span={6} key={product.id}>
                  <Card
                    hoverable
                    cover={
                      <div style={{ position: 'relative' }}>
                        <img
                          alt={product.title}
                          src={product.images}
                          style={{ height: '200px', objectFit: 'scale-down', width: '100%' }}
                        />
                        {starredProducts[product.id] ? (
                          <StarFilled
                            style={{
                              position: 'absolute',
                              top: '10px',
                              right: '10px',
                              fontSize: '24px',
                              color: '#fadb14',
                              zIndex: 1,
                              cursor: 'pointer',
                            }}
                            onClick={() => this.handleStar(product.id)}
                          />
                        ) : (
                          <StarOutlined
                            style={{
                              position: 'absolute',
                              top: '10px',
                              right: '10px',
                              fontSize: '24px',
                              color: '#fadb14',
                              zIndex: 1,
                              cursor: 'pointer',
                            }}
                            onClick={() => this.handleStar(product.id)}
                          />
                        )}
                      </div>
                    }
                  >
                    <Meta
                      title={product.title}
                      description={`$${product.price}`}
                    />
                    <Button
                      type="primary"
                      onClick={() => this.addToCart(product)}
                      style={{ marginTop: '10px', width: '25%' }}
                    >
                      Add to Cart
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Content>
        <Drawer
          title="Shopping Cart"
          placement="right"
          onClose={this.toggleCartVisibility}
          open={isCartVisible}
          styles={{ paddingBottom: '80px' }}
        >
          <Cart 
            items={cartItems} 
            onRemoveItem={this.handleRemoveItem}
            onUpdateQuantity={this.handleUpdateQuantity}
          /> 
        </Drawer>

        <Drawer
          title="Favorite Products"
          placement="left"
          onClose={this.toggleFavoritesVisibility}
          open={isFavoritesVisible}
        >
          {favoriteProducts.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={favoriteProducts}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={item.title}
                    description={`$${item.price}`}
                    avatar={<Avatar src={item.images[0]} />}
                  />
                </List.Item>
              )}
            />
          ) : (
            <Empty description="No Favorites Yet" />
          )}
        </Drawer>
      </Layout>
    );
  }
}

export default Main;
