package com.boot.entity;

@Entity
@Table(name = "AUTO_KEYWORD")
@Getter @Setter
public class AutoKeyword {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String keyword;
    private String link;
}