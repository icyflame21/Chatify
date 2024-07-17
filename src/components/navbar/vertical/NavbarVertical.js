import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Col, Nav, Navbar, Row } from 'react-bootstrap';
import { navbarBreakPoint } from 'config';
import AppContext from 'context/Context';
import Flex from 'components/common/Flex';
import Logo from 'components/common/Logo';
import NavbarVerticalMenu from './NavbarVerticalMenu';
import ToggleButton from './ToggleButton';
import axios from 'axios';
import _ from 'lodash';
import { doc, getDoc } from 'firebase/firestore';
import { OmnifoodServer } from 'config';
import { capitalize } from 'helpers/utils';

const NavbarVertical = () => {
  const defaultImg = 'https://i.ibb.co/16k75S0/meal-1.webp'
  const [loading, setLoading] = useState(false)
  const [routesData, setRoutesData] = useState([])
  const {
    config: {
      isNavbarVerticalCollapsed,
      showBurgerMenu,
    },
    createdRecipesLoading,
    showCreatedRecipes,
    handleCreatedRecipesData,
    handleCreatedRecipesLoading,
    userInfo
  } = useContext(AppContext);

  const HTMLClassList = document.getElementsByTagName('html')[0].classList;

  useEffect(() => {
    if (isNavbarVerticalCollapsed) {
      HTMLClassList.add('navbar-vertical-collapsed');
    } else {
      HTMLClassList.remove('navbar-vertical-collapsed');
    }
    return () => {
      HTMLClassList.remove('navbar-vertical-collapsed-hover');
    };
  }, [isNavbarVerticalCollapsed, HTMLClassList]);


  useEffect(() => {
    if (Object.keys(userInfo).length > 0) {
      setRecipeCreated()
    } else return
  }, [userInfo])

  const setRecipeCreated = async () => {
    handleCreatedRecipesLoading(true)
    const RecipeCreatedRef = doc(OmnifoodServer, userInfo.uid, 'RecipeCreated')
    const RecipeCreatedSnap = await getDoc(RecipeCreatedRef);
    if (RecipeCreatedSnap.exists()) {
      handleCreatedRecipesData(Object.values(RecipeCreatedSnap.data()))
      handleCreatedRecipesLoading(false)
    } else {
      handleCreatedRecipesData([])
      handleCreatedRecipesLoading(false)
    }
  }

  //Control mouseEnter event
  let time = null;
  const handleMouseEnter = () => {
    if (isNavbarVerticalCollapsed) {
      time = setTimeout(() => {
        HTMLClassList.add('navbar-vertical-collapsed-hover');
      }, 100);
    }
  };
  const handleMouseLeave = () => {
    clearTimeout(time);
    HTMLClassList.remove('navbar-vertical-collapsed-hover');
  };

  useEffect(() => {
    if (showCreatedRecipes) {
      getRoutesData()
    } else return
  }, [showCreatedRecipes])

  const getRoutesData = () => {
    setLoading(true)
    let CategoryData = {}, AreaData = {}, IngredientData = {}, modifiedCreatedRecipesRoutes = {}
    axios.get(process.env.REACT_APP_BASE_URL + `categories.php`)
      .then(res => {
        let MealDataByCategory = res.data.categories
        CategoryData = {
          label: 'categoryData',
          children: [
            {
              active: true,
              icon: 'category',
              name: 'Categories',
              children: getCategoryChildrenData(MealDataByCategory)
            }
          ]
        }
        axios.get(process.env.REACT_APP_BASE_URL + `list.php?a=list`)
          .then(res => {
            let MealDataByArea = res.data.meals
            AreaData = {
              label: 'areaData',
              children: [
                {
                  active: true,
                  icon: 'area',
                  name: 'Area',
                  children: getAreaChildrenData(MealDataByArea.filter(ele => ele.strArea != 'Unknown'))
                }
              ]
            }
            axios.get(process.env.REACT_APP_BASE_URL + `list.php?i=list`)
              .then(res => {
                let MealDataByIngredient = res.data.meals
                IngredientData = {
                  label: 'ingredientData',
                  children: [
                    {
                      active: true,
                      icon: 'ingredient',
                      name: 'Ingredients',
                      children: getIngredientChildrenData(MealDataByIngredient.slice(0, 500))
                    }
                  ]
                }
                modifiedCreatedRecipesRoutes = {
                  label: 'Kitchen creations',
                  children: [
                    {
                      active: true,
                      icon: 'foodBank',
                      name: 'My Recipes',
                      children: getCreatedRecipes(showCreatedRecipes)
                    }
                  ]
                }
                if (modifiedCreatedRecipesRoutes.children[0].children.length > 0) {
                  setRoutesData([CategoryData, AreaData, IngredientData, modifiedCreatedRecipesRoutes])
                } else {
                  setRoutesData([CategoryData, AreaData, IngredientData])
                }
                setLoading(false)
              })
          })
      })
  }

  const getCreatedRecipes = (data) => {
    const modifiedData = data.map((ele) => {
      return {
        name: ele.strMeal,
        active: true,
        strCreatedIngredientThumb: ele.strRecipesImages.length > 0 ? ele.strRecipesImages[0].preview : defaultImg,
        idCreatedRecipe: ele.idIngredient
      }
    })
    return modifiedData
  }
  const getIngredientChildrenData = (ingredientData) => {
    const data = ingredientData.map((ele) => {
      return {
        name: ele.strIngredient,
        active: true,
        idIngredient: ele.idIngredient,
        strIngredientThumb: process.env.REACT_APP_PHOTO_URL + ele.strIngredient + '.png'
      }
    })
    return data
  }

  const getAreaChildrenData = (areaData) => {
    const data = areaData.map((ele) => {
      return {
        name: ele.strArea,
        active: true,
        areaCode: true
      }
    })
    return data
  }
  const getCategoryChildrenData = (categoryData) => {
    const data = categoryData.map((ele) => {
      return {
        name: ele.strCategory,
        active: true,
        idCategory: ele.idCategory,
        strCategoryThumb: ele.strCategoryThumb
      }
    })
    return data
  }

  const NavbarLabel = ({ label }) => (
    <Nav.Item as="li">
      <Row className="mt-3 mb-2 navbar-vertical-label-wrapper">
        <Col xs="auto" className="navbar-vertical-label navbar-vertical-label text-danger">
          {label}
        </Col>
        <Col className="ps-0">
          <hr className="mb-0 navbar-vertical-divider"></hr>
        </Col>
      </Row>
    </Nav.Item>
  );
  return (
    <Navbar
      expand={navbarBreakPoint}
      className='navbar-vertical navbar-card'
      variant="light"
    >

      <Flex alignItems="center">
        <ToggleButton />
        <Logo at="navbar-vertical" width={150} />
      </Flex>
      <Navbar.Collapse
        in={showBurgerMenu}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`${loading || createdRecipesLoading ? 'bg-400' : ''}`}
      >
        <div className="navbar-vertical-content scrollbar">
          {loading || createdRecipesLoading ? '' : <Nav className="flex-column" as="ul">
            {routesData.map((route, idx) => (
              <Fragment key={idx}>
                {route.label == 'Kitchen creations' && <NavbarLabel label={capitalize(route.label)} />}
                <NavbarVerticalMenu routes={route.children} />
              </Fragment>
            ))}
          </Nav>}
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
};


export default NavbarVertical;
